import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Subscription } from 'rxjs';
import { MusicKitService } from 'src/app/services/music-kit.service';

const artworkWidth = 50;
const artworkHeight = 50;

@Component({
  selector: 'app-list-song',
  templateUrl: './list-song.component.html',
  styleUrls: ['./list-song.component.css'],
})
export class ListSongComponent implements OnInit, OnDestroy {

  @Input() songs: any[];
  @Input() showArtwork: boolean;
  @Input() showHeaders: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(private playerService: PlayerService, private musicKitService: MusicKitService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
