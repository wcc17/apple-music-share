import { Injectable } from '@angular/core';
import { MusicKitService } from './music-kit.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryPlaylistService {
  private libraryPlaylists: any[] = [];
  private isInitialized: boolean = false;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  public getLibraryPlaylists(): any[] {
    if(!this.isInitialized) {
      this.isInitialized = true;
      this.getLibraryPlaylistsFromIndex(0);
    }

    return this.libraryPlaylists;
  }

  public getSingleLibraryPlaylist(id: string): Observable<any> {
    return from(this.library.playlist(id));
  }

  private getLibraryPlaylistsFromIndex(startIndex: number):void {
    this.fetchLibraryPlaylistsFromAppleMusic(startIndex).subscribe( playlists => {
      if(playlists.length) {
        this.libraryPlaylists = this.libraryPlaylists.concat(playlists);
        this.getLibraryPlaylistsFromIndex(startIndex + this.musicKitService.getLibraryRequestLimit());
      }
    });
  }

  private fetchLibraryPlaylistsFromAppleMusic(startIndex: number): Observable<any> {
    return from(this.library.playlists(null, { limit: this.musicKitService.getLibraryRequestLimit(), offset: startIndex }));
  }

  private getPlaylistsFromIndex(startIndex: number): void {

  }
}
