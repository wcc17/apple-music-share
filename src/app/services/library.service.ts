import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MusicKitService } from './music-kit.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private songRequestLimit: number = 100;
  private library: any = this.musicKitService.getLibrary();

  constructor(private musicKitService: MusicKitService) { }

  getSongs(startIndex: number): Observable<any> {
    return from(this.library.songs( null , { limit: this.songRequestLimit, offset: startIndex }));
  }

  getSongRequestLimit(): number {
    return this.songRequestLimit;
  }
}
