import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundaryDetailsMenuComponent } from './boundary-details-menu.component';

describe('BoundaryDetailsMenuComponent', () => {
  let component: BoundaryDetailsMenuComponent;
  let fixture: ComponentFixture<BoundaryDetailsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundaryDetailsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundaryDetailsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
