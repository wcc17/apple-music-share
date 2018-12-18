import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueueComponent } from './components/queue/queue.component';
import { RecentlyAddedComponent } from './components/recently-added/recently-added.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { SongsComponent } from './components/songs/songs.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'queue', component: QueueComponent },
  { path: 'recently-added', component: RecentlyAddedComponent },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/queue', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
