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

  searchTerm = new Subject<string>();
  
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.apiService.search(this.searchTerm, this.searchType).subscribe(results => {
        this.handleSearchResults(results);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private handleSearchResults(results: any): void {
    //TODO: should look into pagination here. search results do return a "next" URL
    //should be able to use the offset like we do for loading songs chunks at a time
    
    if(this.searchType === 'library') {
      this.songResults = (results['library-songs']) ? results['library-songs'].data : [];
      this.artistResults = (results['library-artists']) ? results['library-artists'].data : [];
      this.albumResults = (results['library-albums']) ? results['library-albums'].data : [];
      this.playlistResults = (results['library-playlists']) ? results['library-playlists'].data : [];
    } else {
      console.log('handle the other search type');
    }
  }
}
