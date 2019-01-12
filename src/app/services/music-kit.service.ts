import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

declare var MusicKit: any;

@Injectable({
  providedIn: 'root'
})
export class MusicKitService {
  private isAuthorized: boolean = false;
  private musicKit: any;

  constructor() { 
    MusicKit.configure({
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFKUFoyU1E3U0YifQ.eyJpc3MiOiI0U1JFNTlGVzk0IiwiaWF0IjoxNTQ3MzIwMDI3LCJleHAiOjE1NDc5MjQ4Mjd9.m6fhtz-UXNSj3sKdV1BzacTa-rTz-M7juVzboQJZTxvISQEfMn-33LprgsQ2LgICG5woFHTeCywHQnWY-aiqtg',
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
}
