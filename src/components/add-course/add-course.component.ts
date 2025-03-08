import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Course } from '../../models/course';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { CourseService } from '../../services/courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent implements OnInit {
  isEdit: boolean = false;
  isToEdit: boolean=JSON.parse(sessionStorage.getItem("isToEdit")||"false");
  isTeahcer: boolean = JSON.parse(sessionStorage.getItem("user") || `{role: "student"}`).role == "teacher";
  courseForm!: FormGroup; 
  categories: Category[] = Category.getCategories();
  private _course: Course = new Course();
  public get course(): Course {
    return this._course;
  }
  public set course(value: Course) {
    this._course = value;
  }
  
  selectedIndexCategory: number = -1;
  inputArray: string[] = [""];
  inputArrayControls: FormControl[] = [];
  changes: boolean[] = [false, false];

  constructor(private _courseService: CourseService, private router: Router) {
    const a = localStorage.getItem("course");
    localStorage.clear();
    let c: Course;
    if (a) {
      c = JSON.parse(a);
      this.course = c;
      this.selectedIndexCategory = c.categoryId;
      this.inputArray = c.syllabus;
      this.inputArray?.push("");
      this.course.id = c.id;
      this.isEdit = true;
    }
    if (this.course.id == null) {
      this.course = new Course();
      this.course.id = 99999;
    }
  }

  // ngOnInit(): void {
  //   this.categories = Category.getCategories();
  //   this.inputArrayControls = this.inputArray.map(input => new FormControl(input));
  // }
  
  ngOnInit(): void {
    // 3. הוספתי קריאה ל-initializeForm כאן
    this.initializeForm();
    this.categories = Category.getCategories();
    this.inputArrayControls = this.inputArray?.map(input => new FormControl(input));
  }
  // 4. פונקציה חדשה ליצירת ה-FormGroup
  initializeForm() {
    this.courseForm = new FormGroup({
      title: new FormControl(this.course.title, [Validators.required]),
      description: new FormControl(this.course.description, [Validators.required]),
      categoryId: new FormControl(this.course.categoryId),
      amount: new FormControl(this.course.amount, [Validators.required, Validators.min(3)]),
      beginDate: new FormControl(this.course.beginDate, [Validators.required]),
      learningType: new FormControl(this.course?.learningType?.toString(), [Validators.required]),
      // image: new FormControl(this.course.image, [Validators.required]),
      lecturerId: new FormControl(this.course.lecturerId)
    });
  }
  public onSelectionCatogoryChanged(event: any): void {
    this.selectedIndexCategory = event.target.selectedIndex;
    console.log(`Selected index: ${this.selectedIndexCategory}`);
  }

  addInput(control: FormControl, i: number) {
    i++;
    if (this.changes[i] && this.inputArray[i] !== control.value || this.isEdit) {
      this.inputArray[i] = control.value;
      if (this.inputArray[i] === "") {
        control.setValue(this.inputArray[i + 1]);
        for (let j = i; j < this.inputArray.length - 1; j++) {
          this.inputArray[j] = this.inputArray[j + 1];
          this.inputArrayControls[j] = this.inputArrayControls[j + 1];
        }
        this.inputArray.pop();
        this.inputArrayControls[this.inputArrayControls.length - 1] = new FormControl('');
      }
      console.log("Value changed and updated");
    } else if (this.changes.length > i && !this.changes[i]) {
      this.inputArray.push(control.value);
      this.changes.push(false);
      this.inputArrayControls.push(new FormControl(''));
      console.log("New input added");
    }
    console.log("The updated array:", this.inputArray);
    this.changes[i] = true;
  }

  token: string = sessionStorage.getItem('token') || '';

  addCourse() {
    this.inputArray?.shift(); // אם יש צורך להסיר פריטים לא רצויים
    this.courseForm.value.id = this.course.id;

    // const courseData = {
    //   title: this.courseForm.value.title, // עכשיו לוקחים את הכותרת מהטופס
    //   description: this.courseForm.value.description, // עכשיו לוקחים את התיאור מהטופס
    //   // אין צורך לשלוח teacherId, זה כבר יגיע מה-token
    //   syllabus: this.inputArray, // אם אתה רוצה לשלוח את הסילבוס
    // };


    const courseData: Course = {
      id: this.course.id, // הוסף את ה-ID
      title: this.courseForm.value.title,
      description: this.courseForm.value.description,
      syllabus: this.inputArray,
      categoryId: this.courseForm.value.categoryId, // הוסף את categoryId
      amount: this.courseForm.value.amount, // הוסף את amount
      beginDate: this.courseForm.value.beginDate, // הוסף את beginDate
      learningType: this.courseForm.value.learningType // הוסף את learningType
  };

    if (this.isToEdit) {
      this._courseService.updateCourse(courseData, this.token).subscribe(
        d => {
            Swal.fire({
                title: `Well done!!! `,
                text: "The course was successfully updated!",
                icon: "success"
            });
            this.router.navigate(['course/allCourses']);
        },
        error => {
            console.log(error);
            Swal.fire({
                title: 'Error!',
                text: 'There was a problem updating the course.',
                icon: 'error'
            });
        }
    );
} else {
    this._courseService.addCourse(courseData, this.token).subscribe(
      d => {
        Swal.fire({
          title: `Well done!!! `,
          text: "The course was successfully added!",
          icon: "success"
        });
        this.router.navigate(['course/allCourses']);
      },
      error => {
        console.log(error);
        
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem adding the course.',
          icon: 'error'
        });
      }
    );
  }
}
  unSaveCourse() {
    this.router.navigate(['course/allCourses']);
  }
}

