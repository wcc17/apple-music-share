import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { LibraryService } from 'src/app/services/library.service';

const artworkWidth = 50;
const artworkHeight = 50;

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {
  constructor(private playerService: PlayerService, private libraryService: LibraryService) { }

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

  getCurrentSongInfo(): string {
    let defaultTitle = 'Welcome to Apple Music Share';

    if(this.playerService.getIsCurrentlyPlaying()) {
      let currentInfo = this.playerService.getCurrentlyPlayingSongInfo();
      return (currentInfo) ? currentInfo : defaultTitle;
    } else {
      return defaultTitle;
    }
  }

  getCurrentSongArtworkUrl(): string {
    if(this.getIsCurrentlyPlaying()) {
      let currentSong = this.getCurrentSong();

      if(currentSong) {
        let artworkUrl = currentSong.artworkURL;

        if(artworkUrl) {
          return this.libraryService.getValidArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
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
}
