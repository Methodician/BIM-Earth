import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundaryFormComponent } from './boundary-form.component';

describe('BoundaryFormComponent', () => {
  let component: BoundaryFormComponent;
  let fixture: ComponentFixture<BoundaryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundaryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
