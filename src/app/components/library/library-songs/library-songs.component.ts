import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { Song } from 'src/app/model/song';

@Component({
  selector: 'app-library-songs',
  templateUrl: './library-songs.component.html',
  styleUrls: ['./library-songs.component.css']
})
export class LibrarySongsComponent implements OnInit {
  
  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void { }

  getLibrarySongs(): Song[] {
    return this.libraryService.getLibrarySongs();
  }
}