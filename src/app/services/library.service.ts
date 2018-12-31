import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MusicKitService } from './music-kit.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private libraryRequestLimit: number = 100;
  private collectionRequestLimit: number = 10;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  getSongs(startIndex: number): Observable<any> {
    return from(this.library.songs(null , { limit: this.libraryRequestLimit, offset: startIndex }));
  }

  getRecentlyAdded(startIndex: number): Observable<any> {
    return from(this.library.collection(
      'recently-added', null, { limit: this.collectionRequestLimit, offset: startIndex }));
  }

  getLibraryAlbums(startIndex: number): Observable<any> {
    return from (this.library.albums(null, { limit: this.libraryRequestLimit, offset: startIndex }));
  }

  getLibraryAlbum(albumId: string): Observable<any> {
    return from(this.library.album(albumId));
  }

  getPlaylists(startIndex: number): Observable<any> {
    return from(this.library.playlists(null, { limit: this.libraryRequestLimit, offset: startIndex }));
  }

  getLibraryArtists(startIndex: number): Observable<any> {
    return from(this.library.artists(null, { limit: this.libraryRequestLimit, offset: startIndex }));
  }

  getLibraryArtist(artistId: string): Observable<any> {
    return from(this.library.artist(artistId, { include: 'albums' } ));
  }

  //TODO: not sure about this
  getArtist(artistId: string): Observable<any> {
    return from(this.musicKitService.getApi().artist(artistId, { include: 'albums' }));
  }

  getPlaylist(id: string): Observable<any> {
    return from(this.library.playlist(id));
  }

  getLibraryRequestLimit(): number {
    return this.libraryRequestLimit;
  }

  getCollectionRequestLimit(): number {
    return this.collectionRequestLimit;
  }
}
