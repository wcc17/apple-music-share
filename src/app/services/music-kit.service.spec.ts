import { TestBed } from '@angular/core/testing';

import { MusicKitService } from './music-kit.service';

describe('MusicKitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicKitService = TestBed.get(MusicKitService);
    expect(service).toBeTruthy();
  });
});
