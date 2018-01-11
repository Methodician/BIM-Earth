import { TestBed, inject } from '@angular/core/testing';

import { RtdbMapService } from './rtdb-map.service';

describe('RtdbMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RtdbMapService]
    });
  });

  it('should be created', inject([RtdbMapService], (service: RtdbMapService) => {
    expect(service).toBeTruthy();
  }));
});
