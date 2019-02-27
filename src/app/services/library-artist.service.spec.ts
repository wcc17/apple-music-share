import { TestBed } from '@angular/core/testing';

import { LibraryArtistService } from './library-artist.service';

describe('LibraryArtistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibraryArtistService = TestBed.get(LibraryArtistService);
    expect(service).toBeTruthy();
  });
});
