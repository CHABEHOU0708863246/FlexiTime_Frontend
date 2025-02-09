import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeContactSupportComponent } from './employe-contact-support.component';

describe('EmployeContactSupportComponent', () => {
  let component: EmployeContactSupportComponent;
  let fixture: ComponentFixture<EmployeContactSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeContactSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeContactSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
