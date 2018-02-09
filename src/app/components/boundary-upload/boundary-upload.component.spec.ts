import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundaryUploadComponent } from './boundary-upload.component';

describe('BoundaryUploadComponent', () => {
  let component: BoundaryUploadComponent;
  let fixture: ComponentFixture<BoundaryUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundaryUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundaryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
