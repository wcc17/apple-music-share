import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { from, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { MusicKitService } from './music-kit.service';

export enum PlaybackState {
  NONE,
  LOADING,
  PLAYING,
  PAUSED,
  STOPPED,
  ENDED,
  SEEKING,
  NULL,
  WAITING,
  STALLED,
  COMPLETED
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private player: any = this.musicKitService.getPlayer();
  private currentSong: any = null;
  private playbackState: PlaybackState = PlaybackState.NONE;

  constructor(private musicKitService: MusicKitService, private titleService: Title) { 
    musicKitService.addMediaItemDidChangeEventListener(this.mediaItemDidChange.bind(this));
    musicKitService.addPlaybackDidChangeEventListener(this.playbackStateDidChange.bind(this));
  }
  
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
    if(this.currentSong) {
      return this.currentSong.attributes.name
        + ' - ' + this.currentSong.attributes.artistName
        + ' - ' + this.currentSong.attributes.albumName;
    }
  }

  getCurrentlyPlayingSong(): any {
    return this.currentSong;
  }
  
  getCurrentlyPlayingSongTitle(): string {
    if(this.currentSong) {
      return this.currentSong.attributes.name;
    }
  }

  getCurrentlyPlayingSongArtist(): string {
    if(this.currentSong) {
      return this.currentSong.attributes.artistName;
    }
  }

  getCurrentlyPlayingSongAlbum(): string {
    if(this.currentSong) {
      return this.currentSong.attributes.albumName;
    }
  }

  getCurrentlyPlayingSongId(): any {
    if(this.currentSong) {
      return this.currentSong.container.id;
    }

    return null;
  }

  getIsCurrentlyPlaying(): boolean {
    return this.playbackState === PlaybackState.PLAYING || this.playbackState === PlaybackState.PAUSED;
  }

  getCurrentPlaybackTime(): number {
    return this.player.currentPlaybackTime;
  }

  getCurrentPlaybackDuration(): number {
    return this.player.currentPlaybackDuration;
  }

  getCurrentPlaybackState(): PlaybackState {
    return this.playbackState;
  }

  setTitle(): void {
    let title = this.getCurrentlyPlayingSongInfo();
    if(!title) {
      title = 'Apple Music Share';
    }

    this.titleService.setTitle(title);
  }

  mediaItemDidChange(event: any): void {
    this.currentSong = event.item;
  }

  playbackStateDidChange(event: any): void {
    this.playbackState = this.getPlaybackStateFromEventPlaybackState(event.state);
    PlaybackState.COMPLETED;
    console.log('break');
  }

  getPlaybackStateFromEventPlaybackState(playbackState: string): PlaybackState {
    let playbackString: string = PlaybackState[playbackState];
    return PlaybackState[playbackString];
  }
}
