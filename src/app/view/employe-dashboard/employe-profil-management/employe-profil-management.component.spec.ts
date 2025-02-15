import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeProfilManagementComponent } from './employe-profil-management.component';

describe('EmployeProfilManagementComponent', () => {
  let component: EmployeProfilManagementComponent;
  let fixture: ComponentFixture<EmployeProfilManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeProfilManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeProfilManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
