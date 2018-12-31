import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MusicKitService } from 'src/app/services/music-kit.service';

@Component({
  selector: 'app-list-album',
  templateUrl: './list-album.component.html',
  styleUrls: ['./list-album.component.css']
})
export class ListAlbumComponent implements OnInit {

  @Input() albums: any[];

  constructor(private router: Router, private musicKitService: MusicKitService) { }

  ngOnInit() { }

  onAlbumSelected(index: number): void {
    let album = this.albums[index];

    if(album.type === 'library-playlists') {
      this.router.navigate(['playlist', album.id]);
    } else if(album.type === 'library-albums') {
      this.router.navigate(['album', album.id]);
    }
  }

  getValidArtworkUrl(index: number): string {
    let artworkUrl: string = this.albums[index].attributes.artwork.url;
    let artworkWidth: number = this.albums[index].attributes.artwork.width;
    let artworkHeight: number = this.albums[index].attributes.artwork.height;
    return this.musicKitService.getFormattedArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
  }

}
