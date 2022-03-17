import { Achievement } from './../shared/Achievement';
import { HttpClient } from '@angular/common/http';
import { baseURL } from './../shared/baseUrl';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsListService {

  constructor(private http: HttpClient) { }

  getParticipantsForSubject(idSubject: number, filter: number)
  {
    const getUrl: string=`${baseURL}/subject/${idSubject}/userdetails/filter/${filter}`;

    return this.http.get(getUrl);
  }

  getAchievementsForUser(idSubject: number|string, idStudent: number)
  {
    const getAchievementsUserUrl: string=`${baseURL}/subject/${idSubject}/user/${idStudent}/achievement`;
    console.log(getAchievementsUserUrl);

    return this.http.get(getAchievementsUserUrl);
  }

  getAchievementsForSubject(idSubject: number|string)
  {
    const getBadgeSubjectUrl: string=`${baseURL}/subject/${idSubject}/achievement`;

    return this.http.get(getBadgeSubjectUrl);
  }

  createAchievement(idSubject: number|string, achievement: Achievement)
  {
    const postAchievementUrl: string=`${baseURL}/subject/${idSubject}/achievement`;

    return this.http.post(postAchievementUrl, achievement);
  }

  assignAchievements(idStudent: number, idAchievements: Array<number>)
  {
    const postAchievementAssignationUrl: string=`${baseURL}/user/${idStudent}/achievement`;

    return this.http.post(postAchievementAssignationUrl, idAchievements);
  }

  unAssignAchievements(idStudent: number, idAchievement: number)
  {
    const deleteAchievementAssignationUrl: string=`${baseURL}/user/${idStudent}/achievement/${idAchievement}`;

    return this.http.delete(deleteAchievementAssignationUrl);
  }

  deleteAchievement(idAchievement: number)
  {
    const deleteAchievementUrl: string=`${baseURL}/achievement/${idAchievement}`;

    return this.http.delete(deleteAchievementUrl);
  }
}
