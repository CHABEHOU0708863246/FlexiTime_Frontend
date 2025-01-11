import { TestBed } from '@angular/core/testing';

import { LeaveBalancesService } from './leave-balances.service';

describe('LeaveBalancesService', () => {
  let service: LeaveBalancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveBalancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
