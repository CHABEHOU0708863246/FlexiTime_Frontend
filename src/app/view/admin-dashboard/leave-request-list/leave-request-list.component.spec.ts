import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestListComponent } from './leave-request-list.component';

describe('LeaveRequestListComponent', () => {
  let component: LeaveRequestListComponent;
  let fixture: ComponentFixture<LeaveRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
