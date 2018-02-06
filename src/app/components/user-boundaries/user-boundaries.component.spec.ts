import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBoundariesComponent } from './user-boundaries.component';

describe('UserBoundariesComponent', () => {
  let component: UserBoundariesComponent;
  let fixture: ComponentFixture<UserBoundariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBoundariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBoundariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
