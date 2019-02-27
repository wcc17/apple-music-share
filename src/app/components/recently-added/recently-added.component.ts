import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-recently-added',
  templateUrl: './recently-added.component.html',
  styleUrls: ['./recently-added.component.css']
})
export class RecentlyAddedComponent implements OnInit {

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void { }

  getRecentlyAdded(): any[] {
    return this.libraryService.getRecentlyAdded();
  }
}
