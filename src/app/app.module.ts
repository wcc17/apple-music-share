import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ContentComponent } from './components/content/content.component';
import { QueueComponent } from './components/queue/queue.component';
import { RecentlyAddedComponent } from './components/recently-added/recently-added.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SingleAlbumComponent } from './components/single-album/single-album.component';
import { ListSongComponent } from './components/list-song/list-song.component';
import { LibrarySongsComponent } from './components/library-songs/library-songs.component';
import { LibraryAlbumsComponent } from './components/library-albums/library-albums.component';
import { ListAlbumComponent } from './components/list-album/list-album.component';
import { SinglePlaylistComponent } from './components/single-playlist/single-playlist.component';
import { SingleCollectionComponent } from './components/single-collection/single-collection.component';
import { LibraryArtistsComponent } from './components/library-artists/library-artists.component';
import { ListArtistComponent } from './components/list-artist/list-artist.component';
import { SingleArtistComponent } from './components/single-artist/single-artist.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MusicPlayerComponent,
    NavigationComponent,
    ContentComponent,
    QueueComponent,
    RecentlyAddedComponent,
    PlaylistsComponent,
    SearchComponent,
    SettingsComponent,
    SingleAlbumComponent,
    ListSongComponent,
    LibrarySongsComponent,
    ListAlbumComponent,
    LibraryAlbumsComponent,
    SinglePlaylistComponent,
    SingleCollectionComponent,
    LibraryArtistsComponent,
    ListArtistComponent,
    SingleArtistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
