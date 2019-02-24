import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { UserService } from 'src/app/services/user.service';
import { QueueService } from 'src/app/services/queue.service';
import { Message } from 'src/app/model/message';
import { ConfigService } from 'src/app/services/config.service';
import { PlayerService } from 'src/app/services/player.service';
import { RoomService } from 'src/app/services/room.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private musicKitService: MusicKitService, 
    private userService: UserService,
    private queueService: QueueService,
    private configService: ConfigService,
    private playerService: PlayerService,
    private roomService: RoomService,
    private messageService: MessageService
  ) { }

  ngOnInit() { }

  connectAndJoinRoom(): void {
    const inputElement: HTMLElement = document.getElementById('roomIdInput');
    const inputValue: string = (<HTMLInputElement> inputElement).value;

    //TODO: if we can't parse a number from the input value, stop here and show an error
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
    
    this.messageService.sendMessage(inputValue);
  }

  getMessages(): Message[] {
    return this.messageService.getMessages();
  }

  hasErrorJoiningRoom(): boolean {
    return this.roomService.getErrorJoiningRoom();
  }

  getRoomId(): number {
    return this.userService.getRoomId();
  }

  toggleAppMode(event: any): void {
    this.configService.setStandAloneAppMode(event.currentTarget.checked);

    if(this.getIsStandAloneAppMode()) {
      //TODO: disconnect the socket stuff, stop playing the shared queue music
    } else {
      this.playerService.stop();
    }
  }

  getIsStandAloneAppMode(): boolean {
    return this.configService.getStandAloneAppMode();
  }

  toggleShouldHideNonAppleMusic(event: any): void {
    this.configService.setShouldHideNonAppleMusic(event.currentTarget.checked);
  }

  getShouldHideNonAppleMusic(): boolean {
    return this.configService.getShouldHideNonAppleMusic();
  }

}
