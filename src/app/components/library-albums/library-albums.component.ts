import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-albums',
  templateUrl: './library-albums.component.html',
  styleUrls: ['./library-albums.component.css']
})
export class LibraryAlbumsComponent implements OnInit {

  constructor(private libraryService: LibraryService) { }

  ngOnInit() { }

  public getLibraryAlbums(): any[] {
    return this.libraryService.getLibraryAlbums();
  }
}
