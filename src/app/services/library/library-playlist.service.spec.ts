import { TestBed } from '@angular/core/testing';

import { LibraryPlaylistService } from './library-playlist.service';

describe('LibraryPlaylistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibraryPlaylistService = TestBed.get(LibraryPlaylistService);
    expect(service).toBeTruthy();
  });
});
