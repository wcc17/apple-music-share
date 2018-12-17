import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueueComponent } from './components/queue/queue.component';
import { RecentlyAddedComponent } from './components/recently-added/recently-added.component';

const routes: Routes = [
  { path: 'queue', component: QueueComponent },
  { path: 'recently-added', component: RecentlyAddedComponent },
  { path: '**', redirectTo: '/queue', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
