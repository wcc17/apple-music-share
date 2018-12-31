import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-albums',
  templateUrl: './library-albums.component.html',
  styleUrls: ['./library-albums.component.css']
})
export class LibraryAlbumsComponent implements OnInit, OnDestroy {

  private albums: any[] = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  private subscriptions: Subscription = new Subscription();

  constructor(private libraryService: LibraryService) { }

  ngOnInit() {
    this.getLibraryAlbums(0);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getLibraryAlbums(startIndex: number):void {
    this.subscriptions.add( 
      this.libraryService.getLibraryAlbums(startIndex).subscribe( albums => {
        if(albums.length) {
          this.albums = this.albums.concat(albums);

          //TODO: remove the length check
          if(this.albums.length < 100) {
            this.getLibraryAlbums(startIndex + this.libraryService.getLibraryRequestLimit());
          }
        }
      })
    );
  }
}
