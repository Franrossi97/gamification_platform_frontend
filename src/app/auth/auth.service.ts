import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {baseURL} from '../shared/baseUrl';
import { Observable } from 'rxjs';
import {LoginUser} from '../shared/LoginUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean
  {
    console.log(localStorage.getItem('currentUser'));
    return (localStorage.getItem('currentUser')!==null);
  }

  authenticating(user: LoginUser): Observable<any>
  {
    console.log(user.mail);
    //console.log(user.password);
    const loginUrl=`${baseURL}/login`;
    return this.http.post<any>(loginUrl, user);
  }
}
