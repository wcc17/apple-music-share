import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor(private musicKitService: MusicKitService) { }

  ngOnInit() {
  }

  authorizeUser(): void {
    this.musicKitService.authorizeUser();
  }

}
