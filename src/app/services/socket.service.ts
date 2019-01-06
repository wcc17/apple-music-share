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

  public onCreateRoom(): Observable<Message> {
    return this.onListen('create-room');
  }

  public onRoomJoined(): Observable<Message> {
    return this.onListen('room-joined');
  }

  public onRoomNotJoined(): Observable<Message> {
    return this.onListen('room-not-joined');
  }

  public onMessage(): Observable<Message> {
    return this.onListen('message');
  }

  public onQueue(): Observable<Message> {
    return this.onListen('queue');
  }

  public onListen(name: string): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on(name, (data: Message) => observer.next(data));
    })
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public send(message: Message, event: string): void {
    this.socket.emit(event, message);
  }

  //TODO: this isn't really being used on server side
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

    this.send(message, 'notification');
  }
}
