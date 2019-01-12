import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { Song } from '../model/song';
import { RoomService } from './room.service';
import { MessageService } from './message.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private isConnected: boolean = false;
  private currentQueue: Song[] = [];

  constructor(
    private socketService: SocketService, 
    private userService: UserService,
    private roomService: RoomService,
    private messageService: MessageService
  ) { }

  public initIoConnection(roomId?: number): void {
    if(!this.isConnected) {
      this.socketService.initSocket();

      this.socketService.onMessage().subscribe((message: Message) => { this.handleMessage(message) });
      this.socketService.onQueue().subscribe((message: Message) => { this.handleQueueSong(message) });
      this.socketService.onEvent(Event.CONNECT).subscribe(() => { this.handleConnectEvent() });
      this.socketService.onEvent(Event.DISCONNECT).subscribe(() => { this.handleDisconnectEvent() });

      this.isConnected = true;
    }

    this.roomService.initRoomService(roomId);
  }

  public queueSong(song: Song): void {
    if(!song) {
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: song,
    }, 'queue');
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: message,
    }, 'message');
  }

  public queueRequest(): void {
    this.socketService.send({
      from: this.userService.getUser(),
    }, 'queue-request');
  }

  private handleMessage(message: Message) {
    this.messageService.pushMessage(message);
    console.log(message.content);
  }

  private handleQueueSong(message: Message) {
    this.handleMessage(message);

    if(message && message.currentQueue) {
      this.currentQueue = message.currentQueue;
    }
  }

  private handleConnectEvent(): void {
    let user: User = this.userService.getUser();
    this.handleMessage(this.messageService.buildMessage('connected ' + user.name, user));
  }

  private handleDisconnectEvent(): void {
    let user: User = this.userService.getUser();
    this.handleMessage(this.messageService.buildMessage('disconnected ' + user.name, user));
  }

  public getCurrentQueue(): Song[] {
    return this.currentQueue;
  }

  public getIsConnected(): boolean {
    //the rest of the application only cares if both of these are true
    return this.isConnected && this.roomService.getHasJoinedRoom();
  }
}
