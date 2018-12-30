import { Component, OnInit, OnDestroy } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { Subscription } from 'rxjs';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { Router } from '@angular/router';

const artworkWidth = 20;
const artworkHeight = 20;

@Component({
  selector: 'app-recently-added',
  templateUrl: './recently-added.component.html',
  styleUrls: ['./recently-added.component.css']
})
export class RecentlyAddedComponent implements OnInit, OnDestroy {

  private recentlyAddedAlbums: any[] = []; //TODO: these are being destroyed and retrieved again every time the user changes routes. Need to keep this somehow
  private subscriptions: Subscription = new Subscription();

  constructor(private libraryService: LibraryService, private musicKitService: MusicKitService, private router: Router) { }

  ngOnInit(): void {
    this.getRecentlyAdded(0);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getRecentlyAdded(startIndex: number): void {
    this.subscriptions.add( 
      this.libraryService.getRecentlyAdded(startIndex).subscribe( recentlyAddedAlbums => {
        if(recentlyAddedAlbums.length) {
          this.recentlyAddedAlbums = this.recentlyAddedAlbums.concat(recentlyAddedAlbums);

          //TODO: remove the length check? or should recently added be limited? will apple even let me get the entire history?
          if(this.recentlyAddedAlbums.length < 100) {
            this.getRecentlyAdded(startIndex + this.libraryService.getCollectionRequestLimit());
          }
        }
      })
    );
  }

  onAlbumSelected(index: number): void {
    //TODO: what if a playlist is selected?
    //TODO: this album object should have a type variable on it
    let album = this.recentlyAddedAlbums[index];

    //TODO: check this behavior
    if(!album.id) {
      console.log('break here');
    }

    this.router.navigate(['album', album.id]);
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
