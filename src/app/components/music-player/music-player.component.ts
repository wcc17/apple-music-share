import { Component, OnInit } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {
  constructor(private musicKitService: MusicKitService) { }

  ngOnInit() { }

  onPlay(): void {
    this.musicKitService.play().subscribe();
  }

  onPause(): void {
    this.musicKitService.pause().subscribe();
  }

  onStop(): void {
    this.musicKitService.stop().subscribe();
  }

  onPrevious(): void {
    this.musicKitService.skipToPrevious().subscribe();
  }

  onNext(): void {
    this.musicKitService.skipToNext().subscribe();
  }

}
