import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { Action } from '../model/action';

import * as socketIo from 'socket.io-client';
import { User } from '../model/user';

const SERVER_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public sendNotification(params: any, action: Action, user: User): void {
    let message: Message;

    if (action === Action.JOINED || action === Action.LEFT) {
      message = {
        from: user,
        action: action
      }
    } else if (action === Action.RENAME) {
      message = {
        from: user,
        action: action,
        content: {
          previousUsername: params.previousUsername
        }
      };
    }

    this.send(message);
  }
  
  public send(message: Message): void {
    this.socket.emit('message', message);
  }
}
