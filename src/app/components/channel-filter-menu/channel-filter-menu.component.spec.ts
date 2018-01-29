import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelFilterMenuComponent } from './channel-filter-menu.component';

describe('ChannelFilterMenuComponent', () => {
  let component: ChannelFilterMenuComponent;
  let fixture: ComponentFixture<ChannelFilterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelFilterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
