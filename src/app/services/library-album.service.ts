import { Injectable } from '@angular/core';
import { MusicKitService } from './music-kit.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryAlbumService {
  private libraryAlbums: any[] = [];
  private isInitialized: boolean = false;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  public getLibraryAlbums(): any[] {
    if(!this.isInitialized) {
      this.isInitialized = true;
      this.getLibraryAlbumsFromIndex(0);
    }

    return this.libraryAlbums;
  }

  public getLibraryAlbum(albumId: string): Observable<any> {
    return from(this.library.album(albumId));
  }

  private getLibraryAlbumsFromIndex(startIndex: number):void {
    this.fetchLibraryAlbumsFromAppleMusic(startIndex).subscribe( albums => {
      if(albums.length) {
        this.libraryAlbums = this.libraryAlbums.concat(albums);
        this.getLibraryAlbumsFromIndex(startIndex + this.musicKitService.getLibraryRequestLimit());
      }
    });
  }

  private fetchLibraryAlbumsFromAppleMusic(startIndex: number): Observable<any> {
    return from(this.library.albums(null, { limit: this.musicKitService.getLibraryRequestLimit(), offset: startIndex }));
  }
}
