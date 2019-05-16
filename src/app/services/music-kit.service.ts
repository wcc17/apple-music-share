import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

declare var MusicKit: any;

@Injectable({
  providedIn: 'root'
})
export class MusicKitService {
  private collectionRequestLimit: number = 10;
  private libraryRequestLimit: number = 100;
  private isAuthorized: boolean = false;
  private musicKit: any;

  constructor() { 
    MusicKit.configure({
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFKUFoyU1E3U0YifQ.eyJpc3MiOiI0U1JFNTlGVzk0IiwiaWF0IjoxNTU4MDM5MjA5LCJleHAiOjE1NjU4MTUyMDl9.QgHVON6ErLcH5LTl-XBwVyKDHYgp8mYoZcMl6tEv4iw2JWDQ5hnDivuL90kYFcCPA-30eVPFfJQ7m5csb6C29A',
      app: { 
        name: 'Apple Music Share',
        build: '1.0'
      }
    });

    //ensure user is authorized
    this.musicKit = MusicKit.getInstance();
    this.isAuthorized = this.musicKit.isAuthorized;
  }

  authorizeUser(): void {
    if(!this.isAuthorized) {
      from(this.musicKit.authorize()).subscribe(() => {
        this.isAuthorized = true;
      })
    }
  }

  unauthorizeUser(): void {
    from(this.musicKit.unauthorize()).subscribe(() => {
      this.isAuthorized = false;
    })
  }

  isUserAuthorized(): boolean {
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

  getApi(): any {
    return this.musicKit.api;
  }

  getFormattedArtworkUrl(artworkUrl: string, width: number, height: number): string {
    return MusicKit.formatArtworkURL( { 'url': artworkUrl }, height, width );
  }

  getFormattedMilliseconds(milliseconds: number) {
    return MusicKit.formattedMilliseconds(milliseconds);
  }

  addMediaItemDidChangeEventListener(eventListener: any) {
    this.musicKit.addEventListener( MusicKit.Events.mediaItemDidChange, eventListener );
  }

  addPlaybackDidChangeEventListener(eventListener: any) {
    this.musicKit.addEventListener( MusicKit.Events.playbackStateDidChange, eventListener );
  }

  getDeveloperToken() {
    return this.musicKit.developerToken;
  }

  getMusicUserToken() {
    return this.musicKit.musicUserToken;
  }

  getLibraryRequestLimit(): number {
    return this.libraryRequestLimit;
  }

  getCollectionRequestLimit(): number {
    return this.collectionRequestLimit;
  }
}
