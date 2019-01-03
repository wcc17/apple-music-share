import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private musicKitService: MusicKitService) { }

  ngOnInit() {
  }

  unauthorizeUser() {
    this.musicKitService.unauthorizeUser();
  }

}
