import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

import { AuthGuard } from '../app/services/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'week-create', component: WeekCreateComponent, canActivate: [AuthGuard] },
  // { path: 'all-weeks', component: AllWeeksComponent, canActivate: [AuthGuard] },
  // { path: 'all-shift-req', component: AllShiftReqComponent, canActivate: [AuthGuard] },
  // { path: 'sidur-list', component: SidurListComponent, canActivate: [AuthGuard] },
  // { path: 'users-list', component: UsersListComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
