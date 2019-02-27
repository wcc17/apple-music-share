import { TestBed } from '@angular/core/testing';

import { LibraryAlbumService } from './library-album.service';

describe('LibraryAlbumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibraryAlbumService = TestBed.get(LibraryAlbumService);
    expect(service).toBeTruthy();
  });
});
