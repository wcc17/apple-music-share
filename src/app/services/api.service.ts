import { Injectable } from '@angular/core';
import { MusicKitService } from './music-kit.service';
import { from, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private appleMusicSearchLimit: number = 50;
  private librarySearchLimit: number = 20;

  constructor(private musicKitService: MusicKitService) { }

  getArtist(artistId: string): Observable<any> {
    return from(this.musicKitService.getApi().artist(artistId, { include: 'albums' }));
  }

  getAlbum(albumId: string ): Observable<any> {
    return from(this.musicKitService.getApi().album(albumId));
  }

  getPlaylist(playlistId: string): Observable<any> {
    return from(this.musicKitService.getApi().playlist(playlistId));
  }

  //https://alligator.io/angular/real-time-search-angular-rxjs/
  search(searchQueries: Observable<string>, searchType: string): Observable<any> {
    return searchQueries
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(searchQuery => {
        return this.searchForType(searchQuery, searchType);
      }));
  }

  private searchForType(searchQuery: string, searchType: string): Observable<any> {
    if(searchQuery !== '') {
      if(searchType === 'library') {
        return this.searchLibrary(searchQuery);
      } else {
        return this.searchAppleMusic(searchQuery);
      }
    }
  }

  private searchAppleMusic(searchQuery: string): Observable<any> {
    const types = ['songs', 'albums', 'artists', 'playlists'];
    return from(this.musicKitService.getApi().search(searchQuery, { types: types, limit: this.appleMusicSearchLimit }));
  }

  private searchLibrary(searchQuery: string): Observable<any> {
    let types = ['library-songs', 'library-albums', 'library-artists', 'library-playlists'];
    return from(this.musicKitService.getApi().library.search(searchQuery, { types: types, limit: this.librarySearchLimit }));
  }

}
