import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeRequestListComponent } from './employe-request-list.component';

describe('EmployeRequestListComponent', () => {
  let component: EmployeRequestListComponent;
  let fixture: ComponentFixture<EmployeRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
