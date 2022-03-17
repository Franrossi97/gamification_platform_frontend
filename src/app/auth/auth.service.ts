import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {baseURL} from '../shared/baseUrl';
import { Observable } from 'rxjs';
import {LoginUser} from '../shared/LoginUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticated(jwt: string): Observable<Object>|Promise<Object>
  {
    const authUrl=`${baseURL}/auth`;

    let header: HttpHeaders=new HttpHeaders();//.set('Authorization',`Bearer ${localStorage.getItem('token')}`)/*('Content-Type', 'application/json')*/;

    header=header.append('Content-Type','Authorization');
    //header=header.append('Authorization',`Bearer ${localStorage.getItem('token')}`);
    header=header.append('Authorization',`Bearer ${jwt}`);
    header=header.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    header=header.append('Access-Control-Allow-Headers', 'Authorization');
    header=header.append('Access-Control-Allow-Methods', 'GET');

    //console.log(header);
    //console.log(localStorage.getItem('currentUser'));
    console.log(localStorage.getItem('token'));

    return this.http.get(authUrl, {headers: header}).toPromise();
    //return (localStorage.getItem('currentUser')!==null);
  }

  authenticating(user: LoginUser): Observable<any>
  {
    console.log(user.mail);
    //console.log(user.password);
    const loginUrl=`${baseURL}/login`;
    return this.http.post<any>(loginUrl, user);
  }
}
