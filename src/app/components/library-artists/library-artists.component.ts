import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-artists',
  templateUrl: './library-artists.component.html',
  styleUrls: ['./library-artists.component.css']
})
export class LibraryArtistsComponent implements OnInit, OnDestroy {

  private artists: any[] = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  private subscriptions: Subscription = new Subscription();

  constructor(private libraryService: LibraryService) { }

  ngOnInit() {
    this.getLibraryArtists(0);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getLibraryArtists(startIndex: number):void {
    this.subscriptions.add( 
      this.libraryService.getLibraryArtists(startIndex).subscribe( artists => {
        if(artists.length) {
          this.artists = this.artists.concat(artists);
          this.getLibraryArtists(startIndex + this.libraryService.getLibraryRequestLimit());
        }
      })
    );
  }
}
