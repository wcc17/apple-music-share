import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';
import { ClientUpdateMessage } from '../model/client-update-message';
import { environment } from 'src/environments/environment';

const SERVER_URL = environment.socket_io_server;

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

  public onLeaderUpdate(): Observable<ClientUpdateMessage> {
    return this.onListenClientUpdate('leader-update');
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

  private onListen(event: string): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on(event, (data: Message) => observer.next(data));
    })
  }

  private onListenClientUpdate(event: string): Observable<ClientUpdateMessage> {
    return new Observable<ClientUpdateMessage>(observer => {
      this.socket.on(event, (data: ClientUpdateMessage) => observer.next(data));
    })
  }
}
