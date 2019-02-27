import { Injectable } from '@angular/core';
import { MusicKitService } from './music-kit.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryArtistService {
  private libraryArtists: any[] = [];
  private isInitialized: boolean = false;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  public getLibraryArtists(): any[] {
    if(!this.isInitialized) {
      this.isInitialized = true;
      this.getAllLibraryArtistsFromIndex(0);
    }

    return this.libraryArtists;
  }

  public getSingleLibraryArtist(artistId: string): Observable<any> {
    return from(this.library.artist(artistId, { include: 'albums' } ));
  }

  private getAllLibraryArtistsFromIndex(startIndex: number): void {
    this.fetchLibraryArtistsFromAppleMusic(startIndex).subscribe( artists => {
      if(artists.length) {
        this.libraryArtists = this.libraryArtists.concat(artists);
        this.getAllLibraryArtistsFromIndex(startIndex + this.musicKitService.getLibraryRequestLimit());
      }
    });
  }

  private fetchLibraryArtistsFromAppleMusic(startIndex: number): Observable<any> {
    return from(this.library.artists(null, { limit: this.musicKitService.getLibraryRequestLimit(), offset: startIndex }));
  }
}
