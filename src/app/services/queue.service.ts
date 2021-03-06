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
import { from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';

const UPDATE_TIME = 3000;
const FORCE_PLAYBACK = true;
const REMOVE_MOST_RECENT_SONG_FROM_QUEUE = true;

//TODO: this class has too much going on and needs to be cleaned up
@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private updateTimer: any;
  private isConnected: boolean = false;
  private currentQueue: Song[] = [];
  private voteCount: number = 0;

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
      this.socketService.onSkipSongForAll().subscribe((message: Message) => { this.handleSkipSongForAll(message) });
      this.socketService.onNewVoteCount().subscribe((message: Message) => { this.handleNewVoteCount(message) });
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

  public queueSong(song: Song, user: User): void {
    if(!song || !this.isConnected) {
      //TODO: should warn user that they're not connected to a room yet or not allow them to click on a song
      return;
    }

    //TODO: this is nasty
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

  public removeSongFromQueue(song: Song): void {
    this.handleRemovalOfCurrentlyPlayingSong(song);

    this.socketService.send({
      from: this.userService.getUser(),
      content: song
    }, 'remove-from-queue');
  }

  public queueRequest(): void {
    this.socketService.send({
      from: this.userService.getUser(),
    }, 'queue-request');
  }

  public voteToSkipCurrentSong(): void {
    let playbackState = this.playerService.getCurrentPlaybackState();
    if(playbackState === PlaybackState.PLAYING) {
      this.socketService.send({
        from: this.userService.getUser(),
      }, 'vote-to-skip');
    }
  }


  public getCurrentQueue(): Song[] {
    return this.currentQueue;
  }

  public getIsConnected(): boolean {
    //the rest of the application only cares if both of these are true
    return this.isConnected && this.roomService.getHasJoinedRoom();
  }

  public getVoteCount(): number {
    return this.voteCount;
  }

  public handleSongCompleted(playbackState: PlaybackState) {
    if(playbackState === PlaybackState.COMPLETED) {
      this.handlePlayNextSong();
    }
  }

  private handleQueueSong(message: Message) {
    this.messageService.handleMessage(message);

    if(message && message.currentQueue) {
      this.currentQueue = message.currentQueue;
    }
  }

  private handleClientUpdate(message: ClientUpdateMessage) {
    this.messageService.handleMessage(message);

    if(this.userService.getIsLeader()) {
      this.handleLeaderUpdate(message);
    } else {
      this.handleFollowerUpdate(message);
    }
  }

  private handleSkipSongForAll(message: Message) {
    from(this.playerService.stop())
      .pipe(map(x => this.handleLeaderUpdate(message)))
      .subscribe();
  }

  private handleNewVoteCount(message: Message) {
    this.voteCount = message.voteCount;
  }

  private handleConnectEvent(): void {
    let user: User = this.userService.getUser();
    this.messageService.handleMessage(this.messageService.buildMessage('connected ' + user.name, user));
  }

  private handleDisconnectEvent(): void {
    let user: User = this.userService.getUser();
    this.messageService.handleMessage(this.messageService.buildMessage('disconnected ' + user.name, user));
  }

  private handleLeaderUpdate(message: Message): void {
    let currentSong: Song = message.currentQueue[0];
    let playbackState = this.playerService.getCurrentPlaybackState();

    console.log('leader playbackstate: ' + playbackState);

    if(currentSong && (playbackState === PlaybackState.NONE || playbackState === PlaybackState.STOPPED)) {
      //play the song and then send the client update to the server, forcing others playback
      from(this.playerService.playSong([currentSong], 0))
        .pipe(map(x => this.sendClientUpdateToServer(FORCE_PLAYBACK, !REMOVE_MOST_RECENT_SONG_FROM_QUEUE)))
        .subscribe();
    }
  }

  private handleFollowerUpdate(message: ClientUpdateMessage): void {
    let playbackTime: number = message.currentPlaybackTime;
    let playbackDuration: number = message.currentPlaybackDuration;
    let playbackState: PlaybackState = message.currentPlaybackState;
    let currentSong: Song = message.currentQueue[0];

    if(currentSong) {
      let leaderWantsToForcePlayback: boolean = message.forcePlayback;
      if(leaderWantsToForcePlayback) {
        this.playSongAndSeekToTime(currentSong, playbackTime);
      } else {
        //ensure the user's playback is similar to the leaders. If not, handle the discrepancy
        this.handlePlaybackDifferences(playbackTime, playbackDuration, playbackState, currentSong);
      }
    }

    //if the message says the user should be the leader, make the user the leader.
    if(message.from.id === this.userService.getUserId() && message.from.isLeader) {
      this.userService.setIsLeader(true);
    }
  }

  //TODO: this isn't actually doing anything useful yet.
  private handleRemovalOfCurrentlyPlayingSong(song: Song) {
    if(this.playerService.getCurrentlyPlayingSong().id === song.id) {

      //have to make sure we're actually stopping the currently playing song and not a duplicate elsewhere in the queue
      let lowestOrderInQueue: number = Number.MAX_VALUE;
      for(let i in this.currentQueue) {
        let order: number = this.currentQueue[i].orderInQueue;
        lowestOrderInQueue = (order < lowestOrderInQueue) ? order : lowestOrderInQueue;
      }

      if(lowestOrderInQueue === song.orderInQueue) {
        // this.playerService.stop();
        // this.handlePlayNextSong

        //TODO: scenarios to consider:
          //1. Leader removes currently playing song from queue
            //leader's song must stop
            //leader must send update to everyone else telling them to stop
            //leader must queue the next song, play it, tell everyone else to play it (this.handlePlayNextSong)

            //NOTE: maybe it will be better to not manually stop the song and wait for a client update to tell us to
          //2. User removes currently playing song from queue
            //user's song must stop
            //either: user sends message to everyone telling them to stop and play the next song
            //leader must queue the next song, play it, tell everyone else to play it (this.handlePlayNextSong)

            //NOTE: maybe it will be better to not manually stop the song and wait for a client update to tell us to

      }
    }
  }

  private handlePlayNextSong() {
    if(this.userService.getIsLeader()) {
      //TODO: this is going to force non-leaders to play the next song, potentially stopping the previous one a bit early. Need to handle this scenario
      //TODO: should wait a few seconds before actually playing the leader's next song and forcing others.
      //the leader will have to wait a couple of seconds for the next song, but it will allow follower's songs to finish and then start immediately
      this.sendClientUpdateToServer(!FORCE_PLAYBACK, REMOVE_MOST_RECENT_SONG_FROM_QUEUE);

      //TODO: another scenario thats going to happen (and has already):
      /**
       * 1. Leader finishes song
       * 2. send client update to the server to remove the most recent song from the queue
       * 3. the server sends the most previous client update containing a force_playback, but the queue hasn't been updated yet
       * 4. the leader starts to play that song again, but then immediately gets the update from 2.) telling it play the next song instead
       * 
       * Fix: should probably give this particular clientMessage a flag that says leader should ignore all other updates
       * until an update with a specific id/timestamp/something comes in so that a song in't repeated
       */

       //TODO: this method also needs to be called in this.removeSongFromQueue
    }

    //if the user is the leader:
      //remove the song from the current queue (make sure you request the latest queue in case anyone has changed it)
      //force an update with the new queue to the server (this will be a tad different than the usual update)
      //set the playbackstate to NONE (if possible) so that when the next update comes through a new song will start
      
    //if the user is not the leader
      //the song should already be removed from the queue
      //match the leader's playback based on its last update. Wait until the next update if the leader's song == the current song
    
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
      let playbackTimeDifference = Math.abs(playbackTime - this.playerService.getCurrentPlaybackTime());
      if(playbackTimeDifference > 10) {
        this.playerService.seekToTime(playbackTime + 2); //adding 2 to account for time spent since leader sent update
      }
    }
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

  private playSongAndSeekToTime(song: Song, playbackTime: number): void {
    from(this.playerService.playSong([song], 0))
        .pipe(switchMap(x => this.playerService.seekToTime(playbackTime)))
        .subscribe();
  }

  private playbackStateDidChange(event: any): void {
    let playbackState: PlaybackState = this.playerService.getCurrentPlaybackState();
    this.handleSongCompleted(playbackState);
  }
}