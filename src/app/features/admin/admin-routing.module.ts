import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../view/admin-dashboard/admin-dashboard.component';
import { UsersListComponent } from '../../view/admin-dashboard/users-list/users-list.component';
import { UsersCreateComponent } from '../../view/admin-dashboard/users-create/users-create.component';
import { LeaveRequestListComponent } from '../../view/admin-dashboard/leave-request-list/leave-request-list.component';
import { AttendanceFollowUpComponent } from '../../view/admin-dashboard/attendance-follow-up/attendance-follow-up.component';
import { LeaveCalendarViewComponent } from '../../view/admin-dashboard/leave-calendar-view/leave-calendar-view.component';

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
    path: 'leave-request-list',
    component: LeaveRequestListComponent
  },
  {
    path: 'leave-calendar-view',
    component: LeaveCalendarViewComponent
  },
  {
    path: 'attendance-follow-up',
    component: AttendanceFollowUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
