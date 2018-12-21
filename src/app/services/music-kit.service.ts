import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var MusicKit: any;

@Injectable({
  providedIn: 'root'
})
export class MusicKitService {
  private isAuthorized: boolean = false;
  private musicKit: any;

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
    this.authorizeUser();
  }

  authorizeUser(): boolean {
    if(!this.isAuthorized) {
      this.musicKit.authorize().then( () => {
        this.isAuthorized = true;
      });
    }

    return this.isAuthorized;
  }

  setQueue(arg: any): Observable<any> {
    return this.musicKit.setQueue(arg);
  }

  getPlayer(): any {
    return this.musicKit.player;
  }

  getLibrary(): any {
    return this.musicKit.api.library;
  }
}
