import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';

//TODO: rename to LibraryPlaylistsComponent
@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit, OnDestroy {

  private playlists: any[] = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  private subscriptions: Subscription = new Subscription();

  constructor(private libraryService: LibraryService) { }

  ngOnInit() {
    this.getPlaylists(0);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getPlaylists(startIndex: number):void {
    this.subscriptions.add( 
      this.libraryService.getPlaylists(startIndex).subscribe( playlists => {
        if(playlists.length) {
          this.playlists = this.playlists.concat(playlists);

          this.getPlaylists(startIndex + this.libraryService.getLibraryRequestLimit());
        }
      })
    );
  }

}
