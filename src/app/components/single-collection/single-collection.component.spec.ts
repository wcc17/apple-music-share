import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCollectionComponent } from './single-collection.component';

describe('SingleCollectionComponent', () => {
  let component: SingleCollectionComponent;
  let fixture: ComponentFixture<SingleCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
