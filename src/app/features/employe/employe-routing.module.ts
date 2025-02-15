import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeDashboardComponent } from '../../view/employe-dashboard/employe-dashboard.component';
import { EmployeRequestForLeaveComponent } from '../../view/employe-dashboard/employe-request-for-leave/employe-request-for-leave.component';
import { EmployeRequestListComponent } from '../../view/employe-dashboard/employe-request-list/employe-request-list.component';
import { EmployeLeaveBalanceComponent } from '../../view/employe-dashboard/employe-leave-balance/employe-leave-balance.component';
import { EmployeProfilManagementComponent } from '../../view/employe-dashboard/employe-profil-management/employe-profil-management.component';
import { EmployeCalendarComponent } from '../../view/employe-dashboard/employe-calendar/employe-calendar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
      path: 'dashboard',
      component: EmployeDashboardComponent
  },
  {
    path: 'request-for-leave',
    component: EmployeRequestForLeaveComponent
  },
  {
    path: 'request-list',
    component: EmployeRequestListComponent
  },
  {
    path: 'leave-balance',
    component: EmployeLeaveBalanceComponent
  },
  {
    path: 'profil-management',
    component: EmployeProfilManagementComponent
  },
  {
    path: 'calendar',
    component: EmployeCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeRoutingModule { }
