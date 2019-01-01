import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  //TODO: definitley need loading animations here during search

  private subscriptions: Subscription = new Subscription();
  private searchType: string = 'library';
  private songResults: any[] = [];
  private artistResults: any[] = [];
  private albumResults: any[] = [];
  private playlistResults: any[] = [];

  librarySearchTerm = new Subject<string>();
  appleSearchTerm = new Subject<string>();
  
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.apiService.search(this.librarySearchTerm, 'library').subscribe(results => {
        this.handleSearchResults(results);
      })
    );

    this.subscriptions.add(
      this.apiService.search(this.appleSearchTerm, 'apple').subscribe(results => {
        this.handleSearchResults(results);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private searchOnKeyUp(searchQuery: string): void {
    if(this.searchType === 'library') {
      this.librarySearchTerm.next(searchQuery)
    } else if(this.searchType === 'apple') {
      this.appleSearchTerm.next(searchQuery);
    }
  }

  private handleSearchResults(results: any): void {
    if(this.searchType === 'library') {
      this.songResults = (results['library-songs']) ? results['library-songs'].data : [];
      this.artistResults = (results['library-artists']) ? results['library-artists'].data : [];
      this.albumResults = (results['library-albums']) ? results['library-albums'].data : [];
      this.playlistResults = (results['library-playlists']) ? results['library-playlists'].data : [];
    } else {
      this.songResults = (results['songs']) ? results['songs'].data : [];
      this.artistResults = (results['artists']) ? results['artists'].data : [];
      this.albumResults = (results['albums']) ? results['albums'].data : [];
      this.playlistResults = (results['playlists']) ? results['playlists'].data : [];
    }
  }

  private changeButton(searchType: string): void {
    this.searchType = searchType;
    
    //make the search happen again automatically when user switches search type
    const inputElement: HTMLElement = document.getElementById('searchInput');
    const inputValue: string = (<HTMLInputElement> inputElement).value;
    
    this.searchOnKeyUp(inputValue);
  }

  private isActiveButton(searchType: string): string {
    if(this.searchType === searchType) {
      return 'btn-primary';
    }

    return '';
  }
}
