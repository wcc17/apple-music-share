import { TestBed } from '@angular/core/testing';

import { LibraryRecentlyAddedService } from './library-recently-added.service';

describe('LibraryRecentlyAddedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibraryRecentlyAddedService = TestBed.get(LibraryRecentlyAddedService);
    expect(service).toBeTruthy();
  });
});
