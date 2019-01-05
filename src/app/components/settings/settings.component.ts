import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private musicKitService: MusicKitService, private userService: UserService) { }

  ngOnInit() {
  }

  unauthorizeUser() {
    this.musicKitService.unauthorizeUser();
  }

  getUserName(): string {
    return this.userService.getUserName();
  }

  setUserName(newUserName: string): void {
    const inputElement: HTMLElement = document.getElementById('nameInput');
    const inputValue: string = (<HTMLInputElement> inputElement).value;

    this.userService.setUserName(inputValue);
  }

}
