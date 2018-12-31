import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-playlist',
  templateUrl: './single-playlist.component.html',
  styleUrls: ['./single-playlist.component.css']
})
export class SinglePlaylistComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  private playlistId: string;
  private playlist: any;

  constructor(private route: ActivatedRoute, private libraryService: LibraryService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => { this.initializePlaylist(params['id'])})
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initializePlaylist(playlistId: string): void {
    this.playlistId = playlistId;
    
    this.subscriptions.add(
      this.libraryService.getPlaylist(playlistId).subscribe(playlist => {
        if(playlist) {
          this.playlist = playlist;
        }
      }
    ));
  }

}
