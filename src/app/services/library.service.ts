import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MusicKitService } from './music-kit.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private songRequestLimit: number = 100;
  private collectionRequestLimit: number = 10;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  getSongs(startIndex: number): Observable<any> {
    return from(this.library.songs(null , { limit: this.songRequestLimit, offset: startIndex }));
  }

  getRecentlyAdded(startIndex: number): Observable<any> {
    return from(this.library.collection(
      'recently-added', null, { limit: this.collectionRequestLimit, offset: startIndex }));
  }

  getSongRequestLimit(): number {
    return this.songRequestLimit;
  }

  getCollectionRequestLimit(): number {
    return this.collectionRequestLimit;
  }
}
