import { Injectable } from '@angular/core';
import { Message } from '../model/message';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];

  constructor() { }

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
}
