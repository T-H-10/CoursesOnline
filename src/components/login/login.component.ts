import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { userInfo } from 'node:os';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private _userService: UserService, private router: Router) {
    this.user = new User();
  }

  hide: boolean = true;
  loginForm!: FormGroup;
  private _user: User = new User();
  public get user(): User {
    return this._user;
  }
  
  @Input()
  public set user(value: User) {
    this._user = value;
    if (this.user != undefined) {
      this.loginForm = new FormGroup({
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        password: new FormControl(this.user.password, [Validators.required, Validators.minLength(3)]),
      })
    }
  }
  loginUser(){
    this.user=this.loginForm.value;
    console.log(this.loginForm.value);
    this._userService.login({email: this.user.email||"", password: this.user.password||"" })
    .subscribe((res:any)=>{
      console.log(res);
      if(res){
        const userId = res.userId;
        this._userService.getUserInfo(userId).subscribe((userInfo: User)=>{
          console.log(userInfo);
          
          this.user = userInfo;
          console.log(this.user);
          
          sessionStorage.setItem("user", JSON.stringify(userInfo));
          Swal.fire({
            title: `Welcome! ${this.user.name}`,
            text: "You've logged in successfully!",
            icon: "success"
          });
          // sessionStorage.setItem("IsLecturer", JSON.stringify(this.user?.isLecturer || false))
          this.router.navigate(['course/allCourses'])
          console.log("Logged in successfully");
          
        }, 
      err=>{
        console.error(err);
        Swal.fire({
          title: `Error fetching user info`,
          text: "Could not retrieve user information.",
          icon: "error"
        });
      });
      }
    },err=>{
        console.error(err);
      Swal.fire({
        title: `Login Failed`,
        text: "Invalid credentials or other error.",
        icon: "error"
      });
      });
    }
}
