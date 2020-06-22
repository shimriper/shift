import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AuthService } from '../../services/auth.service'
import { Res } from 'src/app/models/res.model';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router) { }

  onSignup(form: NgForm) {
    this.authService.createUser(form.value.name, form.value.email, form.value.password, form.value.phone)
      .subscribe((res: Res) => {
        if (res.success) {
          Swal.fire({
            text: 'you are registered!',
            icon: 'success'
          });
          form.reset();
          this.router.navigate(['/login']);
        } else {
          this.opensweetalertdng();
        }
      });
  }





  ngOnInit(): void {
  }

  // sweet alert
  opensweetalert() {
    Swal.fire({
      text: 'Sign - up is succe!',
      icon: 'success'
    });
  }
  opensweetalertdng() {
    Swal.fire('Oops...', 'Something went wrong!', 'error')
  }

  opensweetalertcst() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }



}
