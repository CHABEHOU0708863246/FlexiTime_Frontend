import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayConfigComponent } from './holiday-config.component';

describe('HolidayConfigComponent', () => {
  let component: HolidayConfigComponent;
  let fixture: ComponentFixture<HolidayConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
