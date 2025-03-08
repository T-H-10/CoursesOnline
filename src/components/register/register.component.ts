import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule 
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor(private _userService: UserService, private router: Router) {
    this.user = new User();
  }
  ngOnInit(): void {
    this.userExist = false;
  }
  hide: boolean = true;
  registerForm!: FormGroup;
  private _user: User = new User();
  userExist: boolean = false;
  public get user(): User {
    return this._user;
  }
  name: string = "";
  public set user(value: User) {
    const u = sessionStorage.getItem('user');
    if (u) {
      const us = JSON.parse(u);
      this.name = us.name;
    }
    this._user = value;
    if (this.user != undefined) {
      this.registerForm = new FormGroup({
        name: new FormControl(this.name, [Validators.required, Validators.minLength(3)]),
        address: new FormControl(this.user.address, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        password: new FormControl(this.user.password, [Validators.required, Validators.minLength(3)]),
        course: new FormControl(this.user.course, []),
        role: new FormControl(this.user.role, []),
      })
    }
  }
  registerUser() {
    this.user=this.registerForm.value;
    if(this.registerForm.controls['role'].value=="teacher"){
      this.user.isLecturer=true;
    }
    this._userService.register(this.user).subscribe(
      (res => {
        if (res == undefined) {
          Swal.fire({
            title: `Oops`,
            text: "name in use, please enter another name!",
            icon: "error"
          });          
        }
        else {
          Swal.fire({
            title: `Hi ${this.user?.name}`,
            text: "You have successfully registered!!!",
            icon: "success"
          });
          sessionStorage.setItem("user", JSON.stringify(this.user));
          this.router.navigate(['course/allCourses']);
        }
      }),
      (error => {
        Swal.fire({
          title: `Error`,
          text: error.message || "An error occurred during registration.",
          icon: "error"
        });
      })
    )
  }
}
