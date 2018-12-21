import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

declare var MusicKit: any;

@Injectable({
  providedIn: 'root'
})
export class MusicKitService {
  isAuthorized = false;
  musicKit: any;
  songRequestLimit = 100;

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

  //TODO: need to pass in the index of the song in the playlist its in so that skipToNext and previous work
  //so if we're playing a single song out of the entire list of songs, get the index in that list
  //even if the list isn't all the way loaded, once that particular song is loaded its index won't change
  playSong(id: number): Observable<any> {
    return from(this.musicKit.setQueue({ song: id }))
      .pipe( mergeMap( x => this.play() ));
  }

  getSongs(startIndex: number): Observable<any> {
    return from(this.musicKit.api.library.songs( null , { limit: this.songRequestLimit, offset: startIndex }));
  }

  play(): Observable<any> {
    return from(this.musicKit.player.play());
  }

  pause(): Observable<any> {
    return from(this.musicKit.player.pause());
  }

  stop(): Observable<any> {
    return from(this.musicKit.player.stop());
  }

  skipToNext(): Observable<any> {
    return from(this.musicKit.player.skipToNextItem());
  }

  skipToPrevious(): Observable<any> {
    return from(this.musicKit.player.skipToPreviousItem());
  }
}
