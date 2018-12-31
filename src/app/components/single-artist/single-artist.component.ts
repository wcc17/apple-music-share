import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-single-artist',
  templateUrl: './single-artist.component.html',
  styleUrls: ['./single-artist.component.css']
})
export class SingleArtistComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  private artistId: string;
  private artist: any;

  constructor(private route: ActivatedRoute, private libraryService: LibraryService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => { this.initializeArtist(params['id'])})
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initializeArtist(artistId: string): void {
    this.artistId = artistId;
    
    this.subscriptions.add(
      this.libraryService.getLibraryArtist(artistId).subscribe(artist => {
        if(artist) {
          this.artist = artist;
        }
      }
    ));
  }

}
