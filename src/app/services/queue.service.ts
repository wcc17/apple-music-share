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
  private ioConnection: any;
  private messages: Message[] = [];

  constructor(private socketService: SocketService, private userService: UserService) {
    this.initIoConnection();
  }

  public queueSong(song: Song): void {
    if(!song) {
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: song,
      action: Action.QUEUE
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.userService.getUser(),
      content: message
    });
  }

  public sendTestMessage(): void {
    this.sendMessage('a test message');
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage().subscribe((message: Message) => {
      this.messages.push(message);
      console.log(message.content);
    });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('connected ' + this.userService.getUserName());
    });
      
    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('disconnected ' + this.userService.getUserName());
    });
  }
}
