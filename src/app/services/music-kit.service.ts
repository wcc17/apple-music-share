import { Injectable } from '@angular/core';

declare var MusicKit: any;

@Injectable({
  providedIn: 'root'
})
export class MusicKitService {
  isAuthorized = false;
  musicKit: any;

  constructor() { 
    MusicKit.configure({
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFKUFoyU1E3U0YifQ.eyJpc3MiOiI0U1JFNTlGVzk0IiwiaWF0IjoxNTQ0ODQ3MzA0LCJleHAiOjE1NDQ4OTA1MDR9.abonxZpEaosHOxym2D01kiNMVikwmlRWu_XluGwZ6rZm1t2muEaFtpgw047vrMYp5uOk0AcYgCF2J0J7TvNt7Q',
      app: { 
        name: 'Apple Music Share',
        build: '1.0'
      }
    });

    //ensure user is authorized
    this.musicKit = MusicKit.getInstance();
    this.musicKit.authorize().then( () => {
      this.isAuthorized = true;
    });
  }

  testMethod(): void {
    console.log('calling the test method');

    this.musicKit.setQueue({
      album: '1025210938'
    }).then( () => {
      console.log('going to play the album');
      this.musicKit.play();
    });
  }
}
