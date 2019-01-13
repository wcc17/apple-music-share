import { Injectable } from '@angular/core';
import { Message } from '../model/message';
import { User } from '../model/user';
import { SocketService } from './socket.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];

  constructor(
    private socketService: SocketService,
    private userService: UserService
  ) { }

  public initMessageService(): void {
    this.socketService.onMessage().subscribe((message: Message) => { this.handleMessage(message) });
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

  public getMessages(): Message[] {
    return this.messages;
  }

  public pushMessage(message: Message): void {
    this.messages.push(message);
  }

  public buildMessage(content: string, user: User): Message {
    let message: Message = new Message();
    message.content = content;
    message.from = new User();
    message.from.copyUser(user);
    message.debugMessage = content;

    return message;
  }

  public handleMessage(message: Message) {
    this.pushMessage(message);
    console.log(message.content);
  }
}
