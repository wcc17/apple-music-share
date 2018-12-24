import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Subscription } from 'rxjs';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { LibraryService } from 'src/app/services/library.service';

const artworkWidth = 50;
const artworkHeight = 50;

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {

  private songs: any[] = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  private subscriptions: Subscription = new Subscription();

  constructor(private musicKitService: MusicKitService, 
    private playerService: PlayerService, 
    private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.getAllSongs(0);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getAllSongs(startIndex: number): void {
    this.subscriptions.add( 
      this.libraryService.getSongs( startIndex ).subscribe( songs => {
        if(songs.length) {
          this.songs = this.songs.concat(songs);

          //TODO: remove the length check
          if(songs.length < 100) {
            //TODO: need to handle loading to show the user if songs are still being loaded
            this.getAllSongs(startIndex + this.libraryService.getSongRequestLimit());
          }
      }
    }));
  }

  onSongSelected(index): void {
    this.subscriptions.add(this.playerService.playSong(this.songs, index).subscribe());
  }

  isSelectedSong(index: number): boolean {
    let currentSongId = this.playerService.getCurrentlyPlayingSongId();
    if(currentSongId && this.songs) {
      return (this.songs[index].id === currentSongId);
    }

    return false;
  }

  getMinutesAndSeconds(durationInMillis: any): string {
    let seconds = (durationInMillis / 1000);
    let minutes = (seconds / 60);

    let roundedMinutes = Math.floor(minutes);
    let roundedSeconds = (minutes - Math.floor(minutes)) * 60;
    roundedSeconds = Math.floor(roundedSeconds);

    let roundedSecondsString = roundedSeconds.toString();
    if(roundedSecondsString.length === 1) {
      roundedSecondsString = "0" + roundedSecondsString;
    }

    return roundedMinutes + ':' + roundedSecondsString;
  }

  getValidArtworkUrl(artworkUrl: string): string {
    return this.musicKitService.getFormattedArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
  }

  getArtworkWidth(): number {
    return artworkWidth;
  }

  getArtworkHeight(): number {
    return artworkHeight;
  }
}
