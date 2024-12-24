import { TestBed } from '@angular/core/testing';

import { LeaveReportsService } from './leave-reports.service';

describe('LeaveReportsService', () => {
  let service: LeaveReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
