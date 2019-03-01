import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MusicKitService } from 'src/app/services/music-kit.service';

//Collection can be albums or playlists. They're very similar when they come from Apple's api
@Component({
  selector: 'app-list-collection',
  templateUrl: './list-collection.component.html',
  styleUrls: ['./list-collection.component.css']
})
export class ListCollectionComponent implements OnInit {

  @Input() collections: any[];

  constructor(private router: Router, private musicKitService: MusicKitService) { }

  ngOnInit() { }

  onCollectionSelected(index: number): void {
    let collection = this.collections[index];

    let route: string = '';

    if(collection.type === 'library-playlists' || collection.type === 'playlists') {
      route = 'playlist';
    } else if(collection.type === 'library-albums' || collection.type === 'albums') {
      route = 'album';
    }

    this.router.navigate([route, collection.type, collection.id]);
  }

  getValidArtworkUrl(index: number): string {
    if(this.collections[index].attributes.artwork) {
      let artworkUrl: string = this.collections[index].attributes.artwork.url;
      let artworkWidth: number = this.collections[index].attributes.artwork.width;
      let artworkHeight: number = this.collections[index].attributes.artwork.height;
      return this.musicKitService.getFormattedArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
    } else {
      //TODO: need to return a placeholder image
    }
  }

}
