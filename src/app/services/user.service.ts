import { NewUser } from './../shared/NewUser';
import { baseURL } from './../shared/baseUrl';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  registerExternalUser(newUser: NewUser)
  {
    const postUrl=`${baseURL}/users/external`;

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

  async numberUserType(idUser: number|string, idSubject: number|string): Promise<number>
  {
    const checkUrl: string=`${baseURL}/subject/${idSubject}/user/${idUser}`

    return this.http.get<number>(checkUrl).toPromise();
  }

  getAttemptsofUser(idSubject: number, idLevel: number)
  {
    const getAttemptsUrl: string=`${baseURL}/student/${localStorage.getItem('userId')}/subject/${idSubject}/level/${idLevel}/attempt`;

    return this.http.get<number>(getAttemptsUrl);
  }

  setUsedBoosterOnLevel(idLevel: number|string, idStudent: number)
  {
    const patchUsedBooster: string=`${baseURL}/level/${idLevel}/student/${idStudent}/usedbooster`;

    return this.http.patch(patchUsedBooster, {});
  }

  getStudentCoins(idSubject: number, idStudent: number)
  {
    const getUserCoinsUrl: string=`${baseURL}/subject/${idSubject}/users/${idStudent}/coins`;

    return this.http.get(getUserCoinsUrl);
  }

  setCountCoins(idSubject: number, idStudent: number, coins: number){
    const patchUserCoinsUrl: string=`${baseURL}/subject/${idSubject}/users/${idStudent}/coins`;

    return this.http.patch(patchUserCoinsUrl, coins);
  }

  canDoTeacherTask(idUser: number)
  {
    const getUrl: string=`${baseURL}/user/${idUser}/task`;

    return this.http.get(getUrl);
  }
}
