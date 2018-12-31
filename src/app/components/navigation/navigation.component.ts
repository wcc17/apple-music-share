import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  navbarRoutes: string[] = [
    '/queue',
    '/recently-added',
    '/playlists',
    '/artists',
    '/albums',
    '/songs',
    '/search',
    '/settings'
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.watchRouterChange();
  }

  watchRouterChange(): void {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart && event.navigationTrigger === 'imperative') {
        let url: string = event.url;

        if(!this.navbarRoutes.includes(url)) {
          //TODO: not doing anything with this here yet. Need to deactivate the navbar if one of those navs isn't selected
          console.log('deactivate the navbar selection');
        }
      }
    });
  }

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
