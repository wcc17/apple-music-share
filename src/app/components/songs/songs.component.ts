import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {
  songs = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  subscriptions = new Subscription();
  selectedSongId = null;

  constructor(private musicKitService: MusicKitService) { }

  ngOnInit(): void {
    this.getAllSongs(0);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getAllSongs(startIndex: number): void {
    this.subscriptions.add( 
      this.musicKitService.getSongs( startIndex ).subscribe( songs => {
        if(songs.length) {
          this.songs = this.songs.concat(songs);
          //TODO: need to handle loading to show the user if songs are still being loaded
          this.getAllSongs(startIndex + this.musicKitService.songRequestLimit);
      }
    }));
  }

  onSongSelected(song): void {
    this.selectedSongId = song.id;
    this.subscriptions.add(this.musicKitService.playSong(this.selectedSongId).subscribe());
  }

  isSelectedSong(song): boolean {
    if(this.selectedSongId && song) {
      return (song.id === this.selectedSongId);
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

}
