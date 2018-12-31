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

  //TODO: its very obvious that there is not an animation for when the page is loading

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
      this.libraryService.getLibraryAlbum(albumId).subscribe(album => {
        if(album) {
          this.album = album;
        }
      }
    ));
  }
}
