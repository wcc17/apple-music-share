import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MusicKitService } from './music-kit.service';
import { Song } from '../model/song';
import { LibrarySongService } from './library/library-song.service';
import { LibraryArtistService } from './library/library-artist.service';
import { LibraryRecentlyAddedService } from './library/library-recently-added.service';
import { LibraryAlbumService } from './library/library-album.service';
import { LibraryPlaylistService } from './library/library-playlist.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private library: any = this.musicKitService.getLibrary();

  constructor(
    private musicKitService: MusicKitService,
    private librarySongService: LibrarySongService,
    private libraryArtistService: LibraryArtistService,
    private libraryRecentlyAddedService: LibraryRecentlyAddedService,
    private libraryAlbumService: LibraryAlbumService,
    private libraryPlaylistService: LibraryPlaylistService
  ) { }

  //done:
  public getLibrarySongs(): Song[] {
    return this.librarySongService.getLibrarySongs();
  }

  public getLibraryArtists(): any[] {
    return this.libraryArtistService.getLibraryArtists();
  }

  public getSingleLibraryArtist(artistId: string): Observable<any> {
    return this.libraryArtistService.getSingleLibraryArtist(artistId);
  }

  public getRecentlyAdded(): any[] {
    return this.libraryRecentlyAddedService.getLibraryRecentlyAdded();
  }

  public getLibraryAlbums(): any[] {
    return this.libraryAlbumService.getLibraryAlbums(); 
  }

  public getLibraryAlbum(albumId: string): Observable<any> {
    return this.libraryAlbumService.getLibraryAlbum(albumId);
  }

  public getLibraryPlaylists(): any[] {
    return this.libraryPlaylistService.getLibraryPlaylists();
  }

  public getLibraryPlaylist(id: string): Observable<any> {
    return this.libraryPlaylistService.getSingleLibraryPlaylist(id);
  }
}
