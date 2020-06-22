import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AllWeeksComponent } from './components/all-weeks/all-weeks.component';
import { SidurListComponent } from './components/sidur-list/sidur-list.component';
import { WeekCreateComponent } from './components/week-create/week-create.component';

import { RequestResetPasswordComponent } from './components/request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './components/response-reset-password/response-reset-password.component';


import { AuthGuard } from '../app/services/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'week-create', component: WeekCreateComponent, canActivate: [AuthGuard] },
  { path: 'all-weeks', component: AllWeeksComponent, },
  { path: 'sidur-list', component: SidurListComponent, canActivate: [AuthGuard] },
  { path: 'users-list', component: UserListComponent, canActivate: [AuthGuard] },
  {
    path: 'request-reset-password',
    component: RequestResetPasswordComponent,
  },
  {
    path: 'response-reset-password/:token',
    component: ResponseResetPasswordComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
