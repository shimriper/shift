import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthData } from '../../models/auth-data.model';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  userId: string;
  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.authService.getIsAuth()) {
      this.userId = this.authService.getUserId();

      this.updateUser();
      this.getUser(this.userId);
      this.editForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      })
    }
  }

  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }
  getUser(id) {
    this.authService.getUser(id).subscribe(data => {
      this.editForm.setValue({
        name: data['name'],
        email: data['email'],
        phone: data['phone'],
      });
    });
  }

  updateUser() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    })
  }

  onSubmit() {
    this.submitted = true;
    if (window.confirm('Are you sure?')) {
      this.authService.updateUser_i(this.userId, this.editForm.value)
        .subscribe(res => {
          console.log('Content updated successfully!')
        }, (error) => {
          console.log(error)
        })
    }
  }

}
