import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  USERS: User[] = [];
  constructor(private _http: HttpClient) { }

  private apiURL = 'http://localhost:3000/api';

  register(data: any): Observable<boolean> {
    return this._http.post<boolean>(this.apiURL + '/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    }).pipe(
      tap((res: any) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('userID', res.userId);
      }
      ));
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log(credentials);
    return this._http.post(this.apiURL + '/auth/login', credentials).pipe(
      tap((res: any) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('userID', res.userId);
      }),
      tap((res: any) => console.log(res))
    );
  }
  getUserInfo(userId: string): Observable<User> {
    const token = sessionStorage.getItem('token'); // הנח שה-Token נשמר ב-sessionStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this._http.get<User>(`${this.apiURL}/users/${userId}`,{headers}); // שימוש במסלול הקיים
  }

}
