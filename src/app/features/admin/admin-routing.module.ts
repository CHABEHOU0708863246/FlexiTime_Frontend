import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../view/admin-dashboard/admin-dashboard.component';
import { UsersListComponent } from '../../view/admin-dashboard/users-list/users-list.component';
import { UsersCreateComponent } from '../../view/admin-dashboard/users-create/users-create.component';
import { LeaveRequestListComponent } from '../../view/admin-dashboard/leave-request-list/leave-request-list.component';
import { LeaveCalendarViewComponent } from '../../view/admin-dashboard/leave-calendar-view/leave-calendar-view.component';
import { UsersRoleManagementComponent } from '../../view/admin-dashboard/users-role-management/users-role-management.component';
import { LeaveConfigComponent } from '../../view/admin-dashboard/leave-config/leave-config.component';
import { HolidayConfigComponent } from '../../view/admin-dashboard/holiday-config/holiday-config.component';
import { LeaveReportComponent } from '../../view/admin-dashboard/leave-report/leave-report.component';
import { SettingsFexitimeComponent } from '../../view/admin-dashboard/settings-fexitime/settings-fexitime.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'users-list',
    component: UsersListComponent
  },
  {
    path: 'users-create',
    component: UsersCreateComponent
  },
  {
    path: 'users-role-management',
    component: UsersRoleManagementComponent
  },
  {
    path: 'leave-request-list',
    component: LeaveRequestListComponent
  },
  {
    path: 'leave-config',
    component: LeaveConfigComponent
  },
  {
    path: 'holiday-config',
    component: HolidayConfigComponent
  },
  {
    path: 'leave-report',
    component: LeaveReportComponent
  },
  {
    path: 'leave-calendar-view',
    component: LeaveCalendarViewComponent
  },
  {
    path: 'leave-setting',
    component: SettingsFexitimeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
