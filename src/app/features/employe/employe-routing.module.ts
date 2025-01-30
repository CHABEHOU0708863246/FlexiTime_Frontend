import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeDashboardComponent } from '../../view/employe-dashboard/employe-dashboard.component';
import { EmployeRequestForLeaveComponent } from '../../view/employe-dashboard/employe-request-for-leave/employe-request-for-leave.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeRoutingModule { }
