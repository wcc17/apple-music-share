import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Message } from '../model/message';
import { UserService } from './user.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private hasJoinedRoom: boolean = false;
  private errorJoiningRoom: boolean = false;

  constructor(
    private socketService: SocketService, 
    private userService: UserService,
    private messageService: MessageService
  ) { }

  initRoomService(roomId?: number) {
    this.socketService.onRoomJoined().subscribe((message: Message) => { this.handleRoomJoined(message) });
    this.socketService.onRoomNotJoined().subscribe((message: Message) => { this.handleRoomNotJoined(message) });

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

  private handleRoomJoined(message: Message) {
    this.messageService.handleMessage(message);

    //we can get messages about other users joining the room - don't want to screw up our user though
    if(message.from && message.from.id === this.userService.getUserId()) {
      this.userService.setIsLeader(message.from.isLeader);
      this.userService.setRoomId(message.from.roomId);
      this.hasJoinedRoom = true;
      this.errorJoiningRoom = false;
    }
  }

  private handleRoomNotJoined(message: Message) {
    this.messageService.handleMessage(message);
    
    this.userService.setRoomId(null);
    this.hasJoinedRoom = false;
    this.errorJoiningRoom = true;
  }

  //TODO: this is a bad way to do this
  public getErrorJoiningRoom(): boolean {
    return this.errorJoiningRoom;
  }

  public getHasJoinedRoom(): boolean {
    return this.hasJoinedRoom;
  }
}
