import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';
import { MusicKitService } from 'src/app/services/music-kit.service';

@Component({
  selector: 'app-single-album',
  templateUrl: './single-album.component.html',
  styleUrls: ['./single-album.component.css']
})
export class SingleAlbumComponent implements OnInit, OnDestroy {

  albumId: string;
  album: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute, 
    private libraryService: LibraryService, 
    private musicKitService: MusicKitService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => { this.initializeAlbum(params['id'])})
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  initializeAlbum(albumId: string): void {
    this.albumId = albumId;
    
    this.subscriptions.add(
      this.libraryService.getAlbum(albumId).subscribe(album => {
        if(album) {
          this.album = album;
        }
      }
    ));
  }

  getValidArtworkUrl(width: number, height: number, url: string): string {
    return this.musicKitService.getFormattedArtworkUrl(url, width, height);
  }

  getArtworkUrl(): string {
    if(this.album) {
      let width: number = this.album.attributes.artwork.width;
      let height: number = this.album.attributes.artwork.height;
      let url: string = this.album.attributes.artwork.url;
      return this.getValidArtworkUrl(width, height, url);
    }
  }
}
