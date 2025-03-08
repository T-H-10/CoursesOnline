import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { Course } from '../../models/course';
import { categoriesArray, Category } from '../../models/category';
import { CourseService } from '../../services/courses.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import e from 'express';
@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatCardModule
  ],
  templateUrl: './all-courses.component.html',
  styleUrl: './all-courses.component.css'
})
export class AllCoursesComponent {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  categories: Category[] = [];
  currentDate = new Date();
  categoryControl = new FormControl();
  nextWeekDateString = new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  nextWeekDate = new Date(this.nextWeekDateString);
  currentUserId: number = sessionStorage.getItem("userID") ? parseInt(sessionStorage.getItem("userID")!) : 0;
  currentCourseId: number = sessionStorage.getItem("courseID") ? parseInt(sessionStorage.getItem("courseID")!) : 0;
  getCssClass(course: any) {
    const dateString = course.beginDate;
    if (!dateString) return null;
    const parts = dateString.split('-');
    let dateObject: any;
    if (parts)
      dateObject = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return dateObject < this.nextWeekDateString ? 'date' : null;
  }
  selectedValue = null
  onSelectionChange(event: MatRadioChange) {
    this.selectedValue = event.value;
    console.log('Selected value:', this.selectedValue);
    this.filter()
  }
  selectedCategory: any;
  onCategorySelectionChange(event: MatSelectChange) {
    this.selectedCategory = event.value;
    console.log('Selected category:', this.selectedCategory);
    this.filter()
  }
  filter() {
    this.filteredCourses = this.courses.filter(c => (this.selectedCategory == undefined || c.categoryId === this.selectedCategory.id)
      && (this.selectedValue == undefined || c.learningType == this.selectedValue) && c.title.includes(this.courseName));
  }
  courseName: string = '';
  constructor(private _courseService: CourseService, private _router: Router) {
  }
  mytoken: string | null = '';
  token: string = sessionStorage.getItem("token") || '';
  ngOnInit() {
    if (!sessionStorage.getItem("categories")) {
      Category.saveCategories(categoriesArray);
  }  
    this.mytoken = sessionStorage.getItem("token");
    if (!this.mytoken) {
      Swal.fire({
        title: `You should login!!!`,
        icon: "error",
        timer: 1000
      });
      this._router.navigate(["auth/login"]);
    } else {
      this.token = this.mytoken;
      this._courseService.getCourses(this.token).subscribe(data => {
        this.courses = data;
        this.filteredCourses = data
      })
      Category.getCategories().forEach(d => {
        this.categories.push(d);
      })
      this.user = JSON.parse(sessionStorage.getItem("user")!)
    }
  }
  user: User = new User;

  showDetailes(c: Course) {
    console.log(c);
    sessionStorage.setItem("course", JSON.stringify(c));
    sessionStorage.setItem("courseID", JSON.stringify(c.id));
    if (this.user)
      this._router.navigate(["course/details"]);
    else {
      Swal.fire({
        title: `Oops... `,
        text: "You are not registered yet, register now",
        icon: "warning"
      }); this._router.navigate(["auth/login"])

    }
  }
  editCourse(c: Course) {
    sessionStorage.setItem("isToEdit", JSON.stringify(true));
    localStorage.setItem("course", JSON.stringify(c));
    localStorage.setItem("courseID", JSON.stringify(c.id));
    this._router.navigate(['course/edit']);
  }
  deleteCourse(courseId: number) {
    Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, log out!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Goodbye!",
              text: "You successfully logged out!!!",
              icon: "success"
            });

    this._courseService.deleteCourse(courseId, this.token).subscribe(
        response => {
          console.log(response);
                Swal.fire({
                    title: `Course deleted successfully!`,
                    icon: "success"
                });
                // עדכון הרשימה אחרי מחיקה
                this.courses = this.courses.filter(course => course.id !== courseId);
                this.filteredCourses = this.filteredCourses.filter(course => course.id !== courseId);
        },
        err => {
            // טיפול בשגיאות כלליות
            Swal.fire({
                title: `Error deleting course!`,
                icon: "error"
            });
        }
    );
  }});
}


  joinToCourse(userId: number, token: string) {
    this.currentCourseId = sessionStorage.getItem("courseID") ? +sessionStorage.getItem("courseID")! : 0;
    // this.currentCourseId=c.id;
    this._courseService.enrollStudent(this.currentCourseId, userId, token).subscribe(data => {
      console.log(data);
      // if (data) {
      Swal.fire({
        title: `You have successfully joined the course!!!`,
        icon: "success"
      });
    }
      // else {
      , err => {
        Swal.fire({
          title: `You have already joined this course!!!`,
          icon: "error",
        });
      })
  };

  leaveCourse(userId: number, token: string) {
    this.currentCourseId = sessionStorage.getItem("courseID") ? +sessionStorage.getItem("courseID")! : 0;
    this._courseService.unenrollStudentFromClourse(this.currentCourseId, userId, token).subscribe((data: any) => {
      console.log(data);
      //  if(data){
      Swal.fire({
        title: `You have successfully leaved the course!!!`,
        icon: "success"
      });
    },
      err =>
        Swal.fire({
          title: `You have not been joined this course!!!`,
          icon: "error",
        })
    );
  }
}