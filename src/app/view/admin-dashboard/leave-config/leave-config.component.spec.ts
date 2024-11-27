import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveConfigComponent } from './leave-config.component';

describe('LeaveConfigComponent', () => {
  let component: LeaveConfigComponent;
  let fixture: ComponentFixture<LeaveConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
