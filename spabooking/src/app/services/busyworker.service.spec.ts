import { TestBed } from '@angular/core/testing';

import { BusyworkerService } from './busyworker.service';

describe('BusyworkerService', () => {
  let service: BusyworkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusyworkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
