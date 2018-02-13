import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundaryPostComponent } from './boundary-post.component';

describe('BoundaryPostComponent', () => {
  let component: BoundaryPostComponent;
  let fixture: ComponentFixture<BoundaryPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundaryPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundaryPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
