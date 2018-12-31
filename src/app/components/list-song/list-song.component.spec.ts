import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSongComponent } from './list-song.component';

describe('ListSongComponent', () => {
  let component: ListSongComponent;
  let fixture: ComponentFixture<ListSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
