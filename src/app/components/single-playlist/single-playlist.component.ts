import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-single-playlist',
  templateUrl: './single-playlist.component.html',
  styleUrls: ['./single-playlist.component.css']
})
export class SinglePlaylistComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  private playlistId: string;
  private playlist: any;

  constructor(
    private route: ActivatedRoute, 
    private libraryService: LibraryService,
    private apiService: ApiService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => { this.initializePlaylist(params['id'], params['type'])})
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initializePlaylist(playlistId: string, type: string): void {
    this.playlistId = playlistId;
    
    if(type === 'library-playlists') {
      this.subscriptions.add(this.getLibraryPlaylist());
    } else if(type === 'playlists') {
      this.subscriptions.add(this.getPlaylist());
    }
  }

  private getLibraryPlaylist(): Subscription {
    return this.libraryService.getLibraryPlaylist(this.playlistId).subscribe(playlist => {
      this.setPlaylist(playlist);
    });
  }

  private getPlaylist(): Subscription {
    return this.apiService.getPlaylist(this.playlistId).subscribe(playlist => {
      this.setPlaylist(playlist);
    });
  }

  private setPlaylist(playlist: any): void {
    if(playlist) {
      this.playlist = playlist;
    }
  }

}
