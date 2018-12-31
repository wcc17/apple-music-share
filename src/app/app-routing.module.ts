import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueueComponent } from './components/queue/queue.component';
import { RecentlyAddedComponent } from './components/recently-added/recently-added.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { LibraryAlbumsComponent } from './components/library-albums/library-albums.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SingleAlbumComponent } from './components/single-album/single-album.component';
import { LibrarySongsComponent } from './components/library-songs/library-songs.component';
import { SinglePlaylistComponent } from './components/single-playlist/single-playlist.component';
import { LibraryArtistsComponent } from './components/library-artists/library-artists.component';
import { SingleArtistComponent } from './components/single-artist/single-artist.component';

const routes: Routes = [
  { path: 'queue', component: QueueComponent },
  { path: 'recently-added', component: RecentlyAddedComponent },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'artists', component: LibraryArtistsComponent },
  { path: 'albums', component: LibraryAlbumsComponent },
  { path: 'songs', component: LibrarySongsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'album/:id', component: SingleAlbumComponent },
  { path: 'playlist/:id', component: SinglePlaylistComponent },
  { path: 'artist/:id', component: SingleArtistComponent },
  { path: '**', redirectTo: '/queue', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
