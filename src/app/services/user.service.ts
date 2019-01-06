import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { SocketService } from './socket.service';
import { Action } from '../model/action';

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
    
    this.socketService.sendNotification({ previousUserName: oldName }, Action.RENAME, this.currentUser);
  }

  getRoomId(): number {
    return this.currentUser.roomId;
  }

  setRoomId(roomId: number): void {
    this.currentUser.roomId = roomId;
  }
}
