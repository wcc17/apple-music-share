import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { from, Observable } from 'rxjs';
import { mergeMap, retryWhen, scan } from 'rxjs/operators';
import { MusicKitService } from './music-kit.service';

const RETRY_LIMIT = 2;

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

  addPlaybackDidChangeEventListener(listener: any) {
    this.musicKitService.addPlaybackDidChangeEventListener(listener);
  }
  
  playSong(songs: any[], index: number): Observable<any> {
    if(songs) {
      //songs play without the forEach, but musicKit still complains about not finding container.id in the song object
      songs.forEach(song => song['container'] = { 'id' : song.id });

      return from(this.musicKitService.setQueue({ 'items': songs, startPosition: index}))
        .pipe(mergeMap(x => this.play()));
    }
  }

  play(): Observable<any> {
    return from(this.player.play()).pipe(
      this.retryOperation('play')
    );
  }

  pause(): Observable<any> {
    return from(this.player.pause()).pipe(
      this.retryOperation('pause')
    );
  }

  stop(): Observable<any> {
    return from(this.player.stop()).pipe(
      this.retryOperation('stop')
    );
  }

  skipToNext(): Observable<any> {
    return from(this.player.skipToNextItem()).pipe(
      this.retryOperation('skipToNextItem')
    );
  }

  skipToPrevious(): Observable<any> {
    return from(this.player.skipToPreviousItem()).pipe(
      this.retryOperation('skipToPreviousItem')
    );
  }

  seekToTime(playbackTime: number): Observable<any> {
    return from(this.player.seekToTime(playbackTime)).pipe(
      this.retryOperation('seekToTime')
    );
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
    if(!title || ( (this.playbackState !== PlaybackState.PLAYING) && (this.playbackState !== PlaybackState.PAUSED)) ) {
      title = 'Apple Music Share';
    }

    this.titleService.setTitle(title);
  }

  mediaItemDidChange(event: any): void {
    this.currentSong = event.item;
  }

  playbackStateDidChange(event: any): void {
    this.playbackState = this.getPlaybackStateFromEventPlaybackState(event.state);
    this.setTitle();
  }

  getPlaybackStateFromEventPlaybackState(playbackState: string): PlaybackState {
    let playbackString: string = PlaybackState[playbackState];
    return PlaybackState[playbackString];
  }

  private retryOperation(operation: string) {
    return retryWhen(error => {
      return error.pipe(scan((count, currentErr) => {
        if(count > RETRY_LIMIT) {
          throw currentErr;
        } else {
          console.log('Retrying operation: ' + operation);
          return count += 1
        }
      },0));
    })
  }
}
