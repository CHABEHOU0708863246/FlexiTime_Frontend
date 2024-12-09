import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRoleManagementComponent } from './users-role-management.component';

describe('UsersRoleManagementComponent', () => {
  let component: UsersRoleManagementComponent;
  let fixture: ComponentFixture<UsersRoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersRoleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
