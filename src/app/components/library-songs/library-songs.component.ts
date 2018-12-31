import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-songs',
  templateUrl: './library-songs.component.html',
  styleUrls: ['./library-songs.component.css']
})
export class LibrarySongsComponent implements OnInit, OnDestroy {
  
  private songs: any[] = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  private subscriptions: Subscription = new Subscription();

  constructor(private libraryService: LibraryService) { }

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
          // if(this.songs.length < 100) {
            //TODO: need to handle loading to show the user if songs are still being loaded
            this.getAllSongs(startIndex + this.libraryService.getLibraryRequestLimit());
          // }
      }
    }));
  }
}