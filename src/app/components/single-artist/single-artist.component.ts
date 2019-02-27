import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
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

  constructor(
    private route: ActivatedRoute, 
    private libraryService: LibraryService,
    private apiService: ApiService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => { this.initializeArtist(params['id'], params['type'])})
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initializeArtist(artistId: string, type: string): void {
    this.artistId = artistId;
    
    if(type === 'library-artists') {
      this.subscriptions.add(this.getLibraryArtist());
    } else if(type === 'artists') {
      this.subscriptions.add(this.getArtist());
    }
  }

  private getLibraryArtist(): Subscription {
    return this.libraryService.getSingleLibraryArtist(this.artistId).subscribe(artist => {
      this.setArtist(artist);
    });
  }

  private getArtist(): Subscription {
    return this.apiService.getArtist(this.artistId).subscribe(artist => {
      this.setArtist(artist);
    });
  }

  private setArtist(artist: any): void {
    if(artist) {
      this.artist = artist;
    }
  }

}
