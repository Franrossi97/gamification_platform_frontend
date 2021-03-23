import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseUrl';
import { NewUser } from '../shared/NewUser';
import { User } from '../shared/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerUser(newUser: NewUser): Observable<any>
  {
    const postUrl=`${baseURL}/users`;
    return this.http.post<any>(postUrl, newUser);
  }

  searchUser(identifier:number|string): Observable<User>
  {
    const getUrl=`${baseURL}/users/${identifier}`
    return this.http.get<User>(getUrl);
  }

  linkUsertoSubject(userType:number, idUser:number, idSubject: number|string): Observable<any>
  {
    let postUrl:string;
    console.log(userType);

    if(userType==1)
      postUrl=`${baseURL}/teacher/${idUser}/${idSubject}`;
    else
      postUrl=`${baseURL}/student/${idUser}/${idSubject}`;

    return this.http.post(postUrl, {});
  }

  numberUserType(idUser: number|string, idSubject: number|string): Observable<number>
  {
    const checkUrl: string=`${baseURL}/subject/${idSubject}/user/${idUser}`

    return this.http.get<number>(checkUrl);
  }

  getAttemptsofUser(idLevel: number)
  {
    const getAttemptsUrl: string=`${baseURL}/student/${localStorage.getItem('userId')}/level/${idLevel}/attempt`;

    return this.http.get<number>(getAttemptsUrl);
  }
}
