import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor';


// paaaaa
import { NgbPaginationModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AllWeeksComponent } from './components/all-weeks/all-weeks.component';
import { SidurListComponent } from './components/sidur-list/sidur-list.component';
import { WeekCreateComponent } from './components/week-create/week-create.component';
import { RequestResetPasswordComponent } from './components/request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './components/response-reset-password/response-reset-password.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { EditSidurComponent } from './components/edit-sidur/edit-sidur.component';
import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    UserListComponent,
    AllWeeksComponent,
    SidurListComponent,
    WeekCreateComponent,
    RequestResetPasswordComponent,
    ResponseResetPasswordComponent,
    UserEditComponent,
    MyProfileComponent,
    EditSidurComponent,
    MyDashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbPaginationModule,
    NgbAlertModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ], bootstrap: [AppComponent]
})
export class AppModule { }
