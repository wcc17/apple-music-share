import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  onTabChange(event: NgbTabChangeEvent) {
    console.log(event);

    let eventId = event.nextId;


    switch(eventId) {
      case 'queue':
        this.router.navigateByUrl('/queue');
        break;
      case 'recently-added':
        this.router.navigateByUrl('/recently-added');
        break;
      case 'playlists':
        this.router.navigateByUrl('/playlists');
        break;
      case 'artists':
        this.router.navigateByUrl('/artists');
        break;
      case 'albums':
        this.router.navigateByUrl('/albums');
        break;
      case 'songs':
        this.router.navigateByUrl('/songs');
        break;
      case 'search':
        this.router.navigateByUrl('/search');
        break;
      case 'settings':
        this.router.navigateByUrl('/settings');
        break;
      default:
        this.router.navigateByUrl('/');
        break;
    }
  }
}
