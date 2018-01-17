import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBtnsComponent } from './account-btns.component';

describe('AccountBtnsComponent', () => {
  let component: AccountBtnsComponent;
  let fixture: ComponentFixture<AccountBtnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBtnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
