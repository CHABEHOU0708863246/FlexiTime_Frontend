import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeFAQComponent } from './employe-faq.component';

describe('EmployeFAQComponent', () => {
  let component: EmployeFAQComponent;
  let fixture: ComponentFixture<EmployeFAQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeFAQComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeFAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
