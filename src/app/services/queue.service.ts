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

const UPDATE_TIME = 5000;

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
    private playerService: PlayerService
  ) { }

  public initIoConnection(roomId?: number): void {
    if(!this.isConnected) {
      this.socketService.initSocket();

      this.socketService.onQueue().subscribe((message: Message) => { this.handleQueueSong(message) });
      this.socketService.onLeaderUpdate().subscribe((message: ClientUpdateMessage) => { this.handleClientUpdate(message) });
      this.socketService.onEvent(Event.CONNECT).subscribe(() => { this.handleConnectEvent() });
      this.socketService.onEvent(Event.DISCONNECT).subscribe(() => { this.handleDisconnectEvent() });

      this.isConnected = true;
    }

    this.messageService.initMessageService();
    this.roomService.initRoomService(roomId);

    this.updateTimer = setInterval(() => {
      this.sendClientUpdateToServer();
    }, UPDATE_TIME);
  }

  private sendClientUpdateToServer(): void {
    if(!this.isConnected) {
      return;
    }
    
    console.log('sending client update to server');

    let playbackTime: number = this.playerService.getCurrentPlaybackTime();
    let playbackDuration: number = this.playerService.getCurrentPlaybackDuration();
    let playbackState: PlaybackState = this.playerService.getCurrentPlaybackState();
    console.log('break here');

    //just emit up to date user info to the server
    //TODO: if the user isn't the leader should I even bother?
    if(this.userService.getUser() && this.userService.getUser().roomId) {
      this.socketService.sendClientUpdate({
        from: this.userService.getUser(),
        currentPlaybackTime: playbackTime,
        currentPlaybackDuration: playbackDuration,
        currentPlaybackState: playbackState
      }, 'client-update');
    }
  }

  public queueSong(song: Song): void {
    if(!song || !this.isConnected) {
      //TODO: should warn user that they're not connected to a room yet or not allow them to click on a song
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: song,
    }, 'queue');
  }

  public queueRequest(): void {
    this.socketService.send({
      from: this.userService.getUser(),
    }, 'queue-request');
  }

  private handleQueueSong(message: Message) {
    this.messageService.handleMessage(message);

    if(message && message.currentQueue) {
      this.currentQueue = message.currentQueue;
    }
  }

  private handleClientUpdate(message: ClientUpdateMessage) {
    this.messageService.handleMessage(message);

    //if the playbackstate is NONE, start the song regardless of their status
     //realistically, people won't be joining at the same time, but if they did, the song should start at roughly the same time
    
    //if the user is the leader and the song already has a valid state, do nothing
    //if the user is not the leader, 
      //ensure that the user's playback info is similar (+/- 5 seconds or so) to the leader. If not, fast forward or rewind the song
      //if the message says the user should be the leader, make the user the leader.

    //TODO: in playerService, when the song ends and the user is the leader, force an update to the server
      //the server will emit the next song to EVERYONE and they will either queue it (if their song is still playing, again check similarity 
      //like above) or go ahead and play it. 
    

  }

  private handleConnectEvent(): void {
    let user: User = this.userService.getUser();
    this.messageService.handleMessage(this.messageService.buildMessage('connected ' + user.name, user));
  }

  private handleDisconnectEvent(): void {
    let user: User = this.userService.getUser();
    this.messageService.handleMessage(this.messageService.buildMessage('disconnected ' + user.name, user));
  }

  public getCurrentQueue(): Song[] {
    return this.currentQueue;
  }

  public getIsConnected(): boolean {
    //the rest of the application only cares if both of these are true
    return this.isConnected && this.roomService.getHasJoinedRoom();
  }
}
