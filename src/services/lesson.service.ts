import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:3000/api/courses'; // כתובת ה-API
  
  constructor(private _http: HttpClient) { }

  // קבלת רשימת שיעורים בקורס
  getLessons(courseId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._http.get(`${this.apiUrl}/${courseId}/lessons`, { headers });
  }

  // יצירת שיעור חדש
  createLesson(courseId: number, lessonData: { title: string, content: string }, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._http.post(`${this.apiUrl}/${courseId}/lessons`, lessonData, { headers });
  }

  // עדכון שיעור לפי ID
  updateLesson(courseId: number, lessonId: number, lessonData: { title: string, content: string }, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._http.put(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, lessonData, { headers });
  }

  // מחיקת שיעור לפי ID
  deleteLesson(courseId: number, lessonId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._http.delete(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers });
  }
}
