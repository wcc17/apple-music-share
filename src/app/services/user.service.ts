import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Message } from '../model/message';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User;

  constructor(private socketService: SocketService) { 
    this.currentUser = new User();
    this.currentUser.id = (Math.floor(Math.random() * Math.floor(999999)));

    this.currentUser.name = 'default-' + (Math.floor(Math.random() * Math.floor(999999))).toString();
  }

  getUser(): User {
    return this.currentUser;
  }

  getUserId(): number {
    return this.currentUser.id;
  }

  getUserName(): string {
    return this.currentUser.name;
  }

  setUserName(newUserName: string): void {
    let oldName: string = this.currentUser.name;
    this.currentUser.name = newUserName;
    
    this.sendNameChangeNotification({ previousUserName: oldName }, this.currentUser);
  }

  getRoomId(): number {
    return this.currentUser.roomId;
  }

  setRoomId(roomId: number): void {
    this.currentUser.roomId = roomId;
  }

  setIsLeader(isLeader: boolean): void {
    this.currentUser.isLeader = isLeader;
  }

  public sendNameChangeNotification(params: any, user: User): void {
    let message: Message = {
      from: user,
      content: params.previousUserName.toString() + ' changed their username to ' + user.name
    };

    this.socketService.send(message, 'message');
  }
}
