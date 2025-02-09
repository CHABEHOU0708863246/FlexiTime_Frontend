import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeLeaveBalanceComponent } from './employe-leave-balance.component';

describe('EmployeLeaveBalanceComponent', () => {
  let component: EmployeLeaveBalanceComponent;
  let fixture: ComponentFixture<EmployeLeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeLeaveBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
