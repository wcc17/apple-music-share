import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { UserService } from 'src/app/services/user.service';
import { QueueService } from 'src/app/services/queue.service';
import { Message } from 'src/app/model/message';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private musicKitService: MusicKitService, 
    private userService: UserService,
    private queueService: QueueService) { }

  ngOnInit() { }

  connectAndJoinRoom(): void {
    const inputElement: HTMLElement = document.getElementById('roomIdInput');
    const inputValue: string = (<HTMLInputElement> inputElement).value;

    this.queueService.initIoConnection(Number.parseInt(inputValue));
  }

  createAndJoinRoom(): void {
    this.queueService.initIoConnection();
  }

  getIsSocketConnectionActive(): boolean {
    return this.queueService.getIsConnected();
  }

  unauthorizeUser(): void {
    this.musicKitService.unauthorizeUser();
  }

  getUserName(): string {
    return this.userService.getUserName();
  } 

  setUserName(): void {
    const inputElement: HTMLElement = document.getElementById('nameInput');
    const inputValue: string = (<HTMLInputElement> inputElement).value;

    this.userService.setUserName(inputValue);
  }

  sendTestMessage(): void {
    const inputElement: HTMLElement = document.getElementById('testMessageInput');
    const inputValue: string = (<HTMLInputElement> inputElement).value;
    
    this.queueService.sendMessage(inputValue);
  }

  getMessages(): Message[] {
    return this.queueService.getMessages();
  }

  hasErrorJoiningRoom(): boolean {
    return this.queueService.getErrorJoiningRoom();
  }

  getRoomId(): number {
    return this.userService.getRoomId();
  }

}
