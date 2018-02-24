import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxDialogComponent } from './lightbox-dialog.component';

describe('LightboxDialogComponent', () => {
  let component: LightboxDialogComponent;
  let fixture: ComponentFixture<LightboxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightboxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
