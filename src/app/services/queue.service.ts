import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { Song } from '../model/song';
import { RoomService } from './room.service';
import { MessageService } from './message.service';
import { User } from '../model/user';
import { PlayerService, PlaybackState } from './player.service';
import { ClientUpdateMessage } from '../model/client-update-message';
import { from, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';

const UPDATE_TIME = 3000;
const FORCE_PLAYBACK = true;
const REMOVE_MOST_RECENT_SONG_FROM_QUEUE = true;

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private updateTimer: any;
  private isConnected: boolean = false;
  private currentQueue: Song[] = [];

  constructor(
    private socketService: SocketService, 
    private userService: UserService,
    private roomService: RoomService,
    private messageService: MessageService,
    private playerService: PlayerService,
    private apiService: ApiService
  ) { }

  public initIoConnection(roomId?: number): void {
    if(!this.isConnected) {
      this.socketService.initSocket();

      this.socketService.onQueue().subscribe((message: Message) => { this.handleQueueSong(message) });
      this.socketService.onLeaderUpdate().subscribe((message: ClientUpdateMessage) => { this.handleClientUpdate(message) });
      this.socketService.onEvent(Event.CONNECT).subscribe(() => { this.handleConnectEvent() });
      this.socketService.onEvent(Event.DISCONNECT).subscribe(() => { this.handleDisconnectEvent() });
      this.playerService.addPlaybackDidChangeEventListener(this.playbackStateDidChange.bind(this))

      this.isConnected = true;
    }

    this.messageService.initMessageService();
    this.roomService.initRoomService(roomId);

    this.updateTimer = setInterval(() => {
      this.sendClientUpdateToServer(!FORCE_PLAYBACK, !REMOVE_MOST_RECENT_SONG_FROM_QUEUE);
    }, UPDATE_TIME);
  }

  public getCurrentQueue(): Song[] {
    return this.currentQueue;
  }

  public getIsConnected(): boolean {
    //the rest of the application only cares if both of these are true
    return this.isConnected && this.roomService.getHasJoinedRoom();
  }

  public queueSong(song: Song, user: User): void {
    if(!song || !this.isConnected) {
      //TODO: should warn user that they're not connected to a room yet or not allow them to click on a song
      return;
    }

    let catalogId = song.attributes.playParams.catalogId;
    if(catalogId) {
      from(this.apiService.getAppleMusicSongFromLibrarySong(catalogId))
        .pipe(map(result => {
          if(result.data && result.data.length == 1) {
            let song: Song = result.data[0];
            song.requestedBy = user;
  
            this.socketService.send({
              from: this.userService.getUser(),
              content: song,
            }, 'queue');
  
          } else {
            console.log('error getting song by catalog id');
          }
        })).subscribe();
    } else {
      console.log('The song chosen is not on Apple Music');
    }
  }

  public queueRequest(): void {
    this.socketService.send({
      from: this.userService.getUser(),
    }, 'queue-request');
  }

  public handleSongCompleted() {
    // this.playerService.setCurrentPlaybackState(PlaybackState.NONE);

    //TODO: this is going to force non-leaders to play the next song, potentially stopping the previous one a bit early. Need to handle this scenario
    //will it work to just queue the song up and let it play next? would need to use !FORCE_PLAYBACK instead
    this.sendClientUpdateToServer(FORCE_PLAYBACK, REMOVE_MOST_RECENT_SONG_FROM_QUEUE);


    //if the user is the leader:
      //remove the song from the current queue (make sure you request the latest queue in case anyone has changed it)
      //force an update with the new queue to the server (this will be a tad different than the usual update)
      //set the playbackstate to NONE (if possible) so that when the next update comes through a new song will start
      
    //if the user is not the leader
      //the song should already be removed from the queue
      //match the leader's playback based on its last update. Wait until the next update if the leader's song == the current song
    
  }

  private handleQueueSong(message: Message) {
    this.messageService.handleMessage(message);

    if(message && message.currentQueue) {
      this.currentQueue = message.currentQueue;
    }
  }

  private handleClientUpdate(message: ClientUpdateMessage) {
    this.messageService.handleMessage(message);

    let playbackTime: number = message.currentPlaybackTime;
    let playbackDuration: number = message.currentPlaybackDuration;
    let playbackState: PlaybackState = message.currentPlaybackState;
    let currentSong: Song = message.currentQueue[0];
    let forcePlayback: boolean = message.forcePlayback;

    if(this.userService.getIsLeader()) {
      console.log('leader playbackstate: ' + playbackState);
      if( (playbackState === PlaybackState.NONE || playbackState === PlaybackState.COMPLETED) && currentSong) {
        
        //play the song and then send the client update to the server, forcing others playback
        from(this.playerService.playSong([currentSong], 0))
          .pipe(map(x => this.sendClientUpdateToServer(FORCE_PLAYBACK, !REMOVE_MOST_RECENT_SONG_FROM_QUEUE)))
          .subscribe();
      }
    } else {
      if(forcePlayback) {
        this.playSongAndSeekToTime(currentSong, playbackTime);
      } else {
        //ensure the user's playback is similar to the leaders. If not, handle the discrepancy
        this.handlePlaybackDifferences(playbackTime, playbackDuration, playbackState, currentSong);
      }

      //if the message says the user should be the leader, make the user the leader.
      if(message.from.id === this.userService.getUserId() && message.from.isLeader) {
        this.userService.setIsLeader(true);
      }
    }

    //TODO: should print errors if playback state is in an unexpected state not being handled here
  }

  private handlePlaybackDifferences(playbackTime: number, playbackDuration: number, playbackState: PlaybackState, currentSong: Song) {
    let localPlaybackState: PlaybackState = this.playerService.getCurrentPlaybackState();

    if( (localPlaybackState !== PlaybackState.LOADING) 
        && (localPlaybackState !== PlaybackState.WAITING)
        && (playbackState !== this.playerService.getCurrentPlaybackState()) ) {

      switch(playbackState) {
        case PlaybackState.PLAYING:
          this.playSongAndSeekToTime(currentSong, playbackTime);
          break;
      }
    } else {
      //TODO: compare the times here if needed
      let playbackTimeDifference = Math.abs(playbackTime - this.playerService.getCurrentPlaybackTime());
      if(playbackTimeDifference > 10) {
        this.playerService.seekToTime(playbackTime + 2); //adding 2 to account for time spent since leader sent update
      }
    }


  }

  private handleConnectEvent(): void {
    let user: User = this.userService.getUser();
    this.messageService.handleMessage(this.messageService.buildMessage('connected ' + user.name, user));
  }

  private handleDisconnectEvent(): void {
    let user: User = this.userService.getUser();
    this.messageService.handleMessage(this.messageService.buildMessage('disconnected ' + user.name, user));
  }

  private playSongAndSeekToTime(song: Song, playbackTime: number): void {
    from(this.playerService.playSong([song], 0))
        .pipe(switchMap(x => this.playerService.seekToTime(playbackTime)))
        .subscribe();
  }

  private sendClientUpdateToServer(shouldForcePlayback: boolean, shouldRemoveMostRecentSong: boolean): void {
    if(!this.isConnected) {
      return;
    }
    
    let playbackTime: number = this.playerService.getCurrentPlaybackTime();
    let playbackDuration: number = this.playerService.getCurrentPlaybackDuration();
    let playbackState: PlaybackState = this.playerService.getCurrentPlaybackState();

    console.log('sending client update to server. current playback state: %s', playbackState);

    //just emit up to date user info to the server
    if(this.userService.getUser() && this.userService.getUser().roomId) {
      this.socketService.sendClientUpdate({
        from: this.userService.getUser(),
        currentPlaybackTime: playbackTime,
        currentPlaybackDuration: playbackDuration,
        currentPlaybackState: playbackState,
        forcePlayback: shouldForcePlayback,
        removeMostRecentSong: shouldRemoveMostRecentSong
      }, 'client-update');
    }
  }

  private playbackStateDidChange(event: any): void {
    let playbackState: PlaybackState = this.playerService.getCurrentPlaybackState();
    if(playbackState === PlaybackState.COMPLETED) {
      this.handleSongCompleted();
    }
  }
}
