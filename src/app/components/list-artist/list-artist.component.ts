import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-artist',
  templateUrl: './list-artist.component.html',
  styleUrls: ['./list-artist.component.css']
})
export class ListArtistComponent implements OnInit {

  @Input() artists: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('break');
  }

  onArtistSelected(index: number): void {
    let artist = this.artists[index];
    this.router.navigate(['artist', artist.id]);
  }

}
