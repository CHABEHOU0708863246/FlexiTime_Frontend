import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeCalendarComponent } from './employe-calendar.component';

describe('EmployeCalendarComponent', () => {
  let component: EmployeCalendarComponent;
  let fixture: ComponentFixture<EmployeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
