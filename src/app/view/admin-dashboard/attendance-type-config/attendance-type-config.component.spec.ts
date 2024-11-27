import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTypeConfigComponent } from './attendance-type-config.component';

describe('AttendanceTypeConfigComponent', () => {
  let component: AttendanceTypeConfigComponent;
  let fixture: ComponentFixture<AttendanceTypeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceTypeConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceTypeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
