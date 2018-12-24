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
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFKUFoyU1E3U0YifQ.eyJpc3MiOiI0U1JFNTlGVzk0IiwiaWF0IjoxNTQ1NjgxMTkxLCJleHAiOjE1NDYyODU5OTF9.HRP6oazJIiky785-QTLeAIzDekcgfgfY2PKrqKf8rAj6nAe08A-sfBLsrx7YApp3IZn5bxzstpDigANAlTJxDg',
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
