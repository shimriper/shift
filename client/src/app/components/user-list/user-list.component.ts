import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SmsService } from 'src/app/services/sms.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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
  removeUser(user, index) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.authService.deleteUser(user._id).subscribe((data) => {
          this.users.splice(index, 1);
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
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
