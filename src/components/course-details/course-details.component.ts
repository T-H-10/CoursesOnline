import { Component, OnInit } from '@angular/core';
import { Init } from 'v8';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, LearningType } from '../../models/course';
import { Category } from '../../models/category';
import { User } from '../../models/user';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { IconPipe } from "../../pipes/icon.pipe";
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    IconPipe
],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  constructor(
    private _userService: UserService,
     private _router: Router,
      private _acr: ActivatedRoute,
      // private _lessonService: LessonService
    ) { }
  course?: Course;
  category?: Category;
  learnType = LearningType;
  lecturer?: User = new User;
  lessons: Lesson[]=[];
  mytoken: string | null = '';
  token: string = '';

  ngOnInit(): void {
    let c: Course;
    {
      const course = sessionStorage.getItem("course");
      console.log(course);
      c = JSON.parse(course!)
      this.course = c;
    this.category = Category.getCategories().find(c => c.id === this.course?.categoryId);
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
      // this.loadLessons(); 
    }
  }
  // loadLessons() {
  //   if (this.course) {
  //     this._lessonService.getLessons(this.course.id, this.token).subscribe(
  //       (lessons:Lesson[]) => {
  //         this.lessons = lessons; // שמירת השיעורים במשתנה
  //       },
  //       (error) => {
  //         console.error('Error fetching lessons:', error);
  //       }
  //     );
  //   }
  // }

  print() {
    window.print();
  }
  return() {
    this._router.navigate(['course/allCourses']);
  }
}
