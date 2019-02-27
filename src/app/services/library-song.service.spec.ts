import { TestBed } from '@angular/core/testing';

import { LibrarySongService } from './library-song.service';

describe('LibrarySongService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibrarySongService = TestBed.get(LibrarySongService);
    expect(service).toBeTruthy();
  });
});
