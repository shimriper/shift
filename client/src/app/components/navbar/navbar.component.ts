import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  lastLogin;
  myUserRule;
  userName;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService) { }

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.myUserRule = this.authService.getMyRule();
        this.lastLogin = this.authService.getLastLogin();
        this.userName = this.authService.getUserName();
      });
    if (this.userIsAuthenticated) {
      const data = this.authService.autoAuthUser();
      console.log(data);//null

    }
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
