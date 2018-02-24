import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRouteContainerComponent } from './main-route-container.component';

describe('MainRouteContainerComponent', () => {
  let component: MainRouteContainerComponent;
  let fixture: ComponentFixture<MainRouteContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainRouteContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRouteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
