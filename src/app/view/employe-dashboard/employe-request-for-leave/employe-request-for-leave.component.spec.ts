import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeRequestForLeaveComponent } from './employe-request-for-leave.component';

describe('EmployeRequestForLeaveComponent', () => {
  let component: EmployeRequestForLeaveComponent;
  let fixture: ComponentFixture<EmployeRequestForLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeRequestForLeaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeRequestForLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
