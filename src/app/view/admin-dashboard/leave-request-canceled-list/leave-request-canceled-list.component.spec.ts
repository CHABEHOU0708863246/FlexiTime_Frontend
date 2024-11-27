import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestCanceledListComponent } from './leave-request-canceled-list.component';

describe('LeaveRequestCanceledListComponent', () => {
  let component: LeaveRequestCanceledListComponent;
  let fixture: ComponentFixture<LeaveRequestCanceledListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestCanceledListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestCanceledListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
