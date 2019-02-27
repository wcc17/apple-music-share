import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';

//TODO: rename to LibraryPlaylistsComponent
@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  constructor(private libraryService: LibraryService) { }

  ngOnInit() { }

  getLibraryPlaylists(): any[] {
    return this.libraryService.getLibraryPlaylists();
  }
}
