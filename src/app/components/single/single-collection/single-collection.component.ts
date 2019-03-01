import { Component, OnInit, Input } from '@angular/core';
import { MusicKitService } from 'src/app/services/music-kit.service';

@Component({
  selector: 'app-single-collection',
  templateUrl: './single-collection.component.html',
  styleUrls: ['./single-collection.component.css']
})
export class SingleCollectionComponent implements OnInit {

  @Input() showSongArtwork: Boolean;
  @Input() collection: any;
  private songs: any[];

  constructor(private musicKitService: MusicKitService) { }

  ngOnInit() {
    this.songs = this.collection.relationships.tracks.data;
  }

  getValidArtworkUrl(width: number, height: number, url: string): string {
    return this.musicKitService.getFormattedArtworkUrl(url, width, height);
  }

  getArtworkUrl(): string {
    if(this.collection) {
      let width: number = this.collection.attributes.artwork.width;
      let height: number = this.collection.attributes.artwork.height;
      let url: string = this.collection.attributes.artwork.url;
      return this.getValidArtworkUrl(width, height, url);
    }
  }

}
