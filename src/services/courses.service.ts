import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses';
  constructor(private _http: HttpClient) { }
 // פונקציה לעדכון קורס
updateCourse(courseData: Course, token: string): Observable<any> {
  console.log(`${this.apiUrl}/${courseData.id}`);
  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
     });

  // ודא שהאובייקט כולל את כל השדות הנדרשים
  const updatedCourse = {
    title: courseData.title,
    description: courseData.description,
    teacherId: courseData.lecturerId? courseData.lecturerId : 1 // ודא שהשדה הזה קיים
  };

  return this._http.put(`${this.apiUrl}/${courseData.id}`, updatedCourse, { headers });
}

  getCourses(token: string): Observable<Course[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this._http.get<Course[]>(this.apiUrl, { headers });
  }
  addCourse(courseData: { title: string; description: string; syllabus: any[] }, token: string): Observable<any> {
    return this._http.post(this.apiUrl, courseData, {
      headers: {
        Authorization: `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
      }
    });
  }
  deleteCourse(courseId: number, token: string): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
      }
    }).pipe(
      map((response: any) => {
        // החזרת התגובה במקרה של הצלחה
        return response;
      }),
      catchError((error) => {
        // טיפול בשגיאות והחזרת הודעה מתאימה
        let errorMessage = 'An error occurred while deleting the course.';
        if (error.status === 404) {
          errorMessage = 'Course not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        return of({ success: false, message: errorMessage });
      })
    );
  }

  enrollStudent(courseId: number, userId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/${courseId}/enroll`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      userId: userId
    };

    return this._http.post<any>(url, body, { headers });
  }
  unenrollStudentFromClourse(courseId: number, userId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/${courseId}/unenroll`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      userId: userId
    };

    return this._http.delete<any>(url, { headers, body });
  }
}