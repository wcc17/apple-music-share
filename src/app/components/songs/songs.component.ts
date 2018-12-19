import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  //TODO: I should cache this or keep it somewhere
  songs = [];

  constructor(private musicKitService: MusicKitService) { }

  ngOnInit() {
    this.musicKitService.getSongs().then( (songs) => {
      this.songs = songs;
    });
  }

  onSongSelected(song): void {
    console.log(song);
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
