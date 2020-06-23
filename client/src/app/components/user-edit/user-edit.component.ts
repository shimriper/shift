import { Component, OnInit } from '@angular/core';
import { AuthData } from '../../models/auth-data.model';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  userProfile: any = ['admin', 'user'];

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateUser();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getUser(id);
    this.editForm = this.fb.group({
      name: [''],
      email: [''],
      role: [''],
      phone: [''],
      // name: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      // role: [''],
      // phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],

    })
  }
  // Choose options with select-dropdown
  updateProfile(e) {
    this.editForm.get('role').setValue(e, {
      onlySelf: true
    })
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
        role: data['role'],
        phone: data['phone'],
      });
    });
  }

  updateUser() {
    this.editForm = this.fb.group({
      name: [''],
      email: [''],
      role: [''],
      phone: [''],
    })
  }

  onSubmit() {
    this.submitted = true;
    if (window.confirm('Are you sure?')) {
      let id = this.actRoute.snapshot.paramMap.get('id');
      this.authService.updateUser_i(id, this.editForm.value)
        .subscribe(res => {
          this.router.navigateByUrl('/users-list');
          console.log('Content updated successfully!')
        }, (error) => {
          console.log(error)
        })
    }
  }

}
