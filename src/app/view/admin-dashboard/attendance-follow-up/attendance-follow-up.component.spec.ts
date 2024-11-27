import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceFollowUpComponent } from './attendance-follow-up.component';

describe('AttendanceFollowUpComponent', () => {
  let component: AttendanceFollowUpComponent;
  let fixture: ComponentFixture<AttendanceFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceFollowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
