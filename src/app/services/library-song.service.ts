import { Injectable } from '@angular/core';
import { Song } from '../model/song';
import { MusicKitService } from './music-kit.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrarySongService {
  private librarySongs: Song[] = [];
  private isInitialized: boolean = false;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  public getLibrarySongs(): Song[] {
    if(!this.isInitialized) {
      this.isInitialized = true;
      this.getAllLibrarySongsFromIndex(0);
    }

    return this.librarySongs;
  }

  private getAllLibrarySongsFromIndex(startIndex: number): void {
    this.fetchLibrarySongsFromAppleMusic( startIndex ).subscribe( songs => {
      if(songs.length) {
        this.librarySongs = this.librarySongs.concat(songs);
        this.getAllLibrarySongsFromIndex(startIndex + this.musicKitService.getLibraryRequestLimit());
    }});
  }

  private fetchLibrarySongsFromAppleMusic(startIndex: number): Observable<any> {
    return from(this.library.songs(null , { limit: this.musicKitService.getLibraryRequestLimit(), offset: startIndex }));
  }
}
