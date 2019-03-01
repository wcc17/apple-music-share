import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleArtistComponent } from './single-artist.component';

describe('SingleArtistComponent', () => {
  let component: SingleArtistComponent;
  let fixture: ComponentFixture<SingleArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
