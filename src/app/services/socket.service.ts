import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';
import { ClientUpdateMessage } from '../model/client-update-message';

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

  public sendClientUpdate(message: ClientUpdateMessage, event: string): void {
    this.socket.emit(event, message);
  }
}
