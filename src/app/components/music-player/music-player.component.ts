import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {
  constructor(private playerService: PlayerService) { }

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

}
