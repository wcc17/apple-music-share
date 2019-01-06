import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { Song } from '../model/song';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private isConnected: boolean = false;
  private hasJoinedRoom: boolean = false;
  private errorJoiningRoom: boolean = false;

  private messages: Message[] = [];
  private currentQueue: Song[] = [];

  constructor(private socketService: SocketService, private userService: UserService) { }

  public initIoConnection(roomId?: number): void {
    if(!this.isConnected) {
      this.socketService.initSocket();

      this.socketService.onMessage().subscribe((message: Message) => { this.handleMessage(message) });
      this.socketService.onQueue().subscribe((message: Message) => { this.handleQueueSong(message) });
      this.socketService.onRoomJoined().subscribe((message: Message) => { this.handleRoomJoined(message) });
      this.socketService.onRoomNotJoined().subscribe((message: Message) => { this.handleRoomNotJoined(message) });
  
      this.socketService.onEvent(Event.CONNECT).subscribe(() => {
        console.log('connected ' + this.userService.getUserName());
      });
        
      this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
        console.log('disconnected ' + this.userService.getUserName());
      });

      this.isConnected = true;
    }

    this.joinRoom(roomId);
  }

  public joinRoom(roomId?: number): void {
    if(!roomId) {
      this.socketService.send({
        from: this.userService.getUser()
      }, 'create-room');
    } else {
      this.userService.setRoomId(roomId);
      this.socketService.send({
        from: this.userService.getUser()
      }, 'join-room');
    }
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

  private handleQueueSong(message: Message) {
    this.handleMessage(message);

    if(message && message.currentQueue) {
      this.currentQueue = message.currentQueue;
    }
  }

  private handleMessage(message: Message) {
    this.messages.push(message);
    console.log(message.content);
  }

  private handleRoomJoined(message: Message) {
    this.userService.setRoomId(message.from.roomId);
    this.hasJoinedRoom = true;
    this.errorJoiningRoom = false;

    //get the current queue when first joining in case the user isn't the first one in the room
    this.queueRequest();
  }

  private handleRoomNotJoined(message: Message) {
    this.userService.setRoomId(null);
    this.hasJoinedRoom = false;
    this.errorJoiningRoom = true;
  }



  public getCurrentQueue(): Song[] {
    return this.currentQueue;
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getIsConnected(): boolean {
    //the rest of the application only cares if both of these are true
    return this.isConnected && this.hasJoinedRoom;
  }

  //TODO: this is a bad way to do this
  public getErrorJoiningRoom(): boolean {
    return this.errorJoiningRoom;
  }
}
