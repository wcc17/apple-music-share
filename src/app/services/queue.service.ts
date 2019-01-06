import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { Song } from '../model/song';
import { Action } from '../model/action';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private messages: Message[] = [];
  private currentQueue: Song[] = [];

  constructor(private socketService: SocketService, private userService: UserService) {
    //TODO: eventually want to only init if user specifies a room to join or something along those lines
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onMessage().subscribe((message: Message) => { this.handleMessage(message) });
    this.socketService.onQueue().subscribe((message: Message) => { this.handleQueueSong(message) });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('connected ' + this.userService.getUserName());
    });
      
    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('disconnected ' + this.userService.getUserName());
    });

    this.queueRequest();
  }

  public queueSong(song: Song): void {
    if(!song) {
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: song,
      action: Action.QUEUE
    }, 'queue');
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: message
    }, 'message');
  }

  public queueRequest(): void {
    this.socketService.send({
      from: this.userService.getUser(),
    }, 'queue-request');
  }

  private handleQueueSong(message: Message) {
    this.handleMessage(message);

    if(message && message.currentQueue && message.action === Action.QUEUE) {
      this.currentQueue = message.currentQueue;
    }
  }

  private handleMessage(message: Message) {
    this.messages.push(message);
    console.log(message.content);
  }



  public getCurrentQueue(): Song[] {
    return this.currentQueue;
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public sendTestMessage(): void {
    this.sendMessage('a test message');
  }
}
