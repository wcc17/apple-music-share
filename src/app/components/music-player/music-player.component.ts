import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { ConfigService } from 'src/app/services/config.service';

const artworkWidth = 50;
const artworkHeight = 50;
const defaultTitle = 'Welcome to Apple Music Share';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {
  constructor(
    private playerService: PlayerService, 
    private musicKitService: MusicKitService,
    private configService: ConfigService
  ) { }

  ngOnInit() { }

  onPlay(): void {
    this.playerService.play().subscribe();
  }

  onPause(): void {
    this.playerService.pause().subscribe();
  }

  onStop(): void {
    this.playerService.stop().subscribe();
  }

  onPrevious(): void {
    this.playerService.skipToPrevious().subscribe();
  }

  onNext(): void {
    this.playerService.skipToNext().subscribe();
  }

  getCurrentlyPlayingSongTitle(): string {
    return this.playerService.getCurrentlyPlayingSongTitle();
  }

  getCurrentlyPlayingSongArtist(): string {
    return this.playerService.getCurrentlyPlayingSongArtist();
  }

  getCurrentlyPlayingSongAlbum(): string {
    return this.playerService.getCurrentlyPlayingSongAlbum();
  }

  //TODO: for some reason, apple won't return the proper artwork for songs that were uploaded to icloud
  //TODO: need a placeholder artwork for songs who's artwork won't load
  getCurrentSongArtworkUrl(): string {
    if(this.getIsCurrentlyPlaying()) {
      let currentSong = this.getCurrentSong();

      if(currentSong) {
        let artworkUrl = currentSong.artworkURL;

        if(artworkUrl) {
          return this.musicKitService.getFormattedArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
        }
      }
    }

    return '';
  }

  getIsCurrentlyPlaying(): boolean {
    return this.playerService.getIsCurrentlyPlaying();
  }

  getCurrentSong(): any {
    return this.playerService.getCurrentlyPlayingSong();
  }

  getArtworkWidth(): number {
    return artworkWidth;
  }

  getArtworkHeight(): number {
    return artworkHeight;
  }

  getDefaultTitle(): string {
    return defaultTitle;
  }

  getIsStandAloneAppMode(): boolean {
    return this.configService.getStandAloneAppMode();
  }
}
