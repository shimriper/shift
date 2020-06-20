import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users
    });
  }
  disabledUser(user) {
    if (user.isDisabeld) {
      user.isDisabeld = false;
    } else {
      user.isDisabeld = true;
    }
    var userId = user._id;
    this.authService.UpdateUser(userId, user)
  }
}
