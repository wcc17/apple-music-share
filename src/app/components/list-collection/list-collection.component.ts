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

    if(collection.type === 'library-playlists') {
      this.router.navigate(['playlist', collection.id]);
    } else if(collection.type === 'library-albums') {
      this.router.navigate(['album', collection.id]);
    }
  }

  getValidArtworkUrl(index: number): string {
    let artworkUrl: string = this.collections[index].attributes.artwork.url;
    let artworkWidth: number = this.collections[index].attributes.artwork.width;
    let artworkHeight: number = this.collections[index].attributes.artwork.height;
    return this.musicKitService.getFormattedArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
  }

}
