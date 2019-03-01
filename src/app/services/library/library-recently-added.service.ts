import { Injectable } from '@angular/core';
import { MusicKitService } from '../music-kit.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryRecentlyAddedService {
  private libraryRecentlyAdded: any[] = [];
  private isInitialized: boolean = false;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  public getLibraryRecentlyAdded(): any[] {
    if(!this.isInitialized) {
      this.isInitialized = true;
      this.getRecentlyAddedFromIndex(0);
    }

    return this.libraryRecentlyAdded;
  }

  private getRecentlyAddedFromIndex(startIndex: number): void {
    this.fetchRecentlyAddedFromAppleMusic(startIndex).subscribe( recentlyAddedAlbums => {
      if(recentlyAddedAlbums.length) {
        this.libraryRecentlyAdded = this.libraryRecentlyAdded.concat(recentlyAddedAlbums);
        this.getRecentlyAddedFromIndex(startIndex + this.musicKitService.getCollectionRequestLimit());
      }
    });
  }

  private fetchRecentlyAddedFromAppleMusic(startIndex: number): Observable<any> {
    return from(this.library.collection(
      'recently-added', null, { limit: this.musicKitService.getCollectionRequestLimit(), offset: startIndex }));
  }
}
