import { Component, OnInit, OnDestroy } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library-artists',
  templateUrl: './library-artists.component.html',
  styleUrls: ['./library-artists.component.css']
})
export class LibraryArtistsComponent implements OnInit {

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void { }

  getLibraryArtists(): any[] {
    return this.libraryService.getLibraryArtists();
  }
}
