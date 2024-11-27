import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestRefusedListComponent } from './leave-request-refused-list.component';

describe('LeaveRequestRefusedListComponent', () => {
  let component: LeaveRequestRefusedListComponent;
  let fixture: ComponentFixture<LeaveRequestRefusedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestRefusedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestRefusedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
