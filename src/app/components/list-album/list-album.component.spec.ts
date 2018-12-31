import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAlbumComponent } from './list-album.component';

describe('ListAlbumComponent', () => {
  let component: ListAlbumComponent;
  let fixture: ComponentFixture<ListAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
