import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCollectionComponent } from './list-collection.component';

describe('ListCollectionComponent', () => {
  let component: ListCollectionComponent;
  let fixture: ComponentFixture<ListCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
