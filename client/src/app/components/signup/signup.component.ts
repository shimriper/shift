import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(    // public fb: FormBuilder,
    public authService: AuthService,
    public router: Router) { }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.authService.createUser(form.value.name, form.value.email, form.value.password,form.value.phone);
    form.resetForm();
  }
  ngOnInit(): void {
  }

}
