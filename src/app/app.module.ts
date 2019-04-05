import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { QueueComponent } from './components/queue/queue.component';
import { RecentlyAddedComponent } from './components/recently-added/recently-added.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LibrarySongsComponent } from './components/library/library-songs/library-songs.component';
import { LibraryAlbumsComponent } from './components/library/library-albums/library-albums.component';
import { LibraryArtistsComponent } from './components/library/library-artists/library-artists.component';
import { SingleAlbumComponent } from './components/single/single-album/single-album.component';
import { SinglePlaylistComponent } from './components/single/single-playlist/single-playlist.component';
import { SingleCollectionComponent } from './components/single/single-collection/single-collection.component';
import { SingleArtistComponent } from './components/single/single-artist/single-artist.component';
import { ListSongComponent } from './components/list/list-song/list-song.component';
import { ListCollectionComponent } from './components/list/list-collection/list-collection.component';
import { ListArtistComponent } from './components/list/list-artist/list-artist.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { WarningModalComponent } from './components/warning-modal/warning-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MusicPlayerComponent,
    NavigationComponent,
    QueueComponent,
    RecentlyAddedComponent,
    PlaylistsComponent,
    SearchComponent,
    SettingsComponent,
    SingleAlbumComponent,
    ListSongComponent,
    LibrarySongsComponent,
    ListCollectionComponent,
    LibraryAlbumsComponent,
    SinglePlaylistComponent,
    SingleCollectionComponent,
    LibraryArtistsComponent,
    ListArtistComponent,
    SingleArtistComponent,
    AuthenticationComponent,
    WarningModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatTabsModule
  ],
  entryComponents: [WarningModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
