import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryArtistsComponent } from './library-artists.component';

describe('LibraryArtistsComponent', () => {
  let component: LibraryArtistsComponent;
  let fixture: ComponentFixture<LibraryArtistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryArtistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
