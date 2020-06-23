import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SmsService } from 'src/app/services/sms.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users;
  constructor(public authService: AuthService,
    public smsService: SmsService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  sendSms(user) {
    this.smsService.sendSms(user).subscribe(data => {
      console.log(data);
    })
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
