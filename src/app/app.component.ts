import { Component } from '@angular/core';
import { MusicKitService } from './services/music-kit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  //reserve the constructor for simple initilization
  constructor(private musicKitService: MusicKitService) { }

  //use this for real stuff 
  ngOnInit() {
  }

  isUserAuthorized(): boolean {
    return this.musicKitService.isUserAuthorized();
  }
}
