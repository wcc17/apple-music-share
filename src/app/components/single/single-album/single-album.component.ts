import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-single-album',
  templateUrl: './single-album.component.html',
  styleUrls: ['./single-album.component.css']
})
export class SingleAlbumComponent implements OnInit, OnDestroy {

  //TODO: its very obvious that there is not an animation for when the page is loading

  albumId: string;
  album: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute, 
    private libraryService: LibraryService, 
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => { this.initializeAlbum(params['id'], params['type'])})
    );
  }
 
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeAlbum(albumId: string, type: string): void {
    this.albumId = albumId;
    
    if(type === 'library-albums') {
      this.subscriptions.add(this.getLibraryAlbum());
    } else if(type === 'albums') {
      this.subscriptions.add(this.getAlbum());
    }
  }

  private getLibraryAlbum(): Subscription {
    return this.libraryService.getLibraryAlbum(this.albumId).subscribe(album => {
      this.setAlbum(album);
    });
  }

  private getAlbum(): Subscription {
    return this.apiService.getAlbum(this.albumId).subscribe(album => {
      this.setAlbum(album);
    });
  }

  private setAlbum(album: any): void {
    if(album) {
      this.album = album;
    }
  }
}
