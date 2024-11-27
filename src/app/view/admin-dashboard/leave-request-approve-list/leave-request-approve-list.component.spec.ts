import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestApproveListComponent } from './leave-request-approve-list.component';

describe('LeaveRequestApproveListComponent', () => {
  let component: LeaveRequestApproveListComponent;
  let fixture: ComponentFixture<LeaveRequestApproveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestApproveListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
