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
