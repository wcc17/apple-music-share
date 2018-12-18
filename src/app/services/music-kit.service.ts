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
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFKUFoyU1E3U0YifQ.eyJpc3MiOiI0U1JFNTlGVzk0IiwiaWF0IjoxNTQ0OTc3MTU0LCJleHAiOjE1NDU1ODE5NTR9.HXKv30tNE9GoCD5QmVHu9WCdrGOHp1zJohziWugfkixTmEBfsa745CM-3Ovq6eVLSvmFNX-lvIs8hQ4ZGfLwhA',
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
