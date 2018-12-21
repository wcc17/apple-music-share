import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { from, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { MusicKitService } from './music-kit.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private player: any = this.musicKitService.getPlayer();

  constructor(private musicKitService: MusicKitService, private titleService: Title) { }
  
  playSong(songs: any[], index: number): Observable<any> {
    if(songs) {
      //songs play without the forEach, but musicKit still complains about not finding container.id in the song object
      songs.forEach(song => song['container'] = { 'id' : song.id });

      return from(this.musicKitService.setQueue({ 'items': songs, startPosition: index}))
        .pipe(mergeMap(x => this.play()));
    }
  }

  /**
   * Method that ensures information across the application is updated
   * when the song changes.
   * @param arg 
   */
  modifyPlayback(arg: Observable<any>): Observable<any> {
    return arg.pipe(map(x => this.setTitle()));
  }

  play(): Observable<any> {
    return this.modifyPlayback(from(this.player.play()));
  }

  pause(): Observable<any> {
    return this.modifyPlayback(from(this.player.pause()));
  }

  stop(): Observable<any> {
    return this.modifyPlayback(from(this.player.stop()));
  }

  skipToNext(): Observable<any> {
    return this.modifyPlayback(from(this.player.skipToNextItem()));
  }

  skipToPrevious(): Observable<any> {
    return this.modifyPlayback(from(this.player.skipToPreviousItem()));
  }

  getCurrentlyPlayingSongInfo(): string {
    let currentSong = this.getCurrentlyPlayingSong();

    if(currentSong) {
      return this.getSongName(currentSong) 
        + ' - ' + this.getArtistName(currentSong)
        + ' - ' + this.getAlbumName(currentSong);
    }
  }

  getCurrentlyPlayingSong(): any {
    let currentPosition = this.player.queue.position;
    let currentItem = this.player.queue.items[currentPosition];
    return currentItem;
  }

  getCurrentlyPlayingSongId(): any {
    let currentSong = this.getCurrentlyPlayingSong();
    if(currentSong) {
      return currentSong.container.id;
    }

    return null;
  }

  setTitle(): void {
    let title = this.getCurrentlyPlayingSongInfo();
    if(!title) {
      title = 'Apple Music Share';
    }

    this.titleService.setTitle(title);
  }

  private getArtistName(song: any) {
    return song.attributes.artistName;
  }

  private getAlbumName(song: any) {
    return song.attributes.albumName;
  }

  private getSongName(song: any) {
    return song.attributes.name;
  }

}
