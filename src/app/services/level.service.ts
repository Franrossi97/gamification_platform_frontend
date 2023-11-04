import { BadgeTimer } from './../shared/BadgeTimer';
import { BadgeQuestions } from './../shared/BadgeQuestion';
import { BadgeDate } from './../shared/BadgeDate';
import { BadgeAttempts } from './../shared/BadgeAttempts';
import { Level } from './../shared/Level';
import { UnitService } from './unit.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseUrl';
import { Unit } from '../shared/Unit';

@Injectable({
  providedIn: 'root'
})
export class LevelService
{

  levelMaxScore: BehaviorSubject<number>;
  //countLevels: BehaviorSubject<number>;
  countLevels: number;
  countQuestionsLevel: BehaviorSubject<number>;
  idSubject: BehaviorSubject<number>;
  PLAYING_LEVEL_ID: number=undefined;
  constructor(private http: HttpClient, private unitService:UnitService) { }

  getLevels(idSubject:number|string): Observable<Level[]>
  {
    const url =`${baseURL}/subject/${idSubject}/levels`;

    return this.http.get<Level[]>(url);
  }

  getLevelsWithVerification(idSubject: number|string, idStudent: number) {
    const getUrl = `${baseURL}/subject/${idSubject}/student/${idStudent}/levels`;

    return this.http.get<Array<Level>>(getUrl);
  }

  getOneLevel(idLevel: number)
  {
    const getUrl =`${baseURL}/level/${idLevel}`;

    return this.http.get<Level>(getUrl);
  }

  getUnits(idLevel:number|string): Observable<Unit[]>
  {
    return this.unitService.getUnits(idLevel);
  }

  createLevel(newLevel: Level, idSubject: number|string)
  {
    const postUrl =`${baseURL}/subject/${idSubject}/level`;
    console.log(newLevel);

    return this.http.post(postUrl, newLevel);
  }

  deleteLevel(idLevel: number)
  {
    const deleteUrl =`${baseURL}/level/${idLevel}`;

    return this.http.delete(deleteUrl);
  }

  getAttempts(idLevel: number|string, idSubject: number): Observable<number>
  {
    const getAttemptsUrl =`${baseURL}/subject/${idSubject}/level/${idLevel}/attempts`;

    return this.http.get<number>(getAttemptsUrl);
  }

  allowAttempt(idSubject: number, idLevel: number|string, idUser: number|string)
  {
    const getBooleanAttemptUrl =`${baseURL}/user/${idUser}/subject/${idSubject}/level/${idLevel}/allowattempts`;

    return this.http.get(getBooleanAttemptUrl);
  }

  changeAvailability(idSubject: number, idLevel: number|string, status: boolean)
  {
    const patchUrl =`${baseURL}/subject/${idSubject}/level/${idLevel}/availability`;

    console.log(patchUrl);
    console.log(status);


    return this.http.patch(patchUrl, !status);
  }

  receiveCountLevels(count: number)
  {
    this.countLevels=count;
  }

  getCountLevels(idSubject: number)
  {
    //return this.countLevels;
    const getCountUrl =`${baseURL}/subject/${idSubject}/levelsamount`

    return this.http.get<number>(getCountUrl);
  }

  sendMaxScore(maxScore: number)
  {
    this.levelMaxScore=new BehaviorSubject(maxScore);
  }

  sendSubjectId(subjectId: number)
  {
    this.idSubject=new BehaviorSubject(subjectId)
  }

  getSubjectId()
  {
    return this.idSubject;
  }

  getMaxScore(): Observable<number>
  {
    return this.levelMaxScore.asObservable();
  }

  receiveCountQuestions(count: number)
  {
    this.countQuestionsLevel=new BehaviorSubject(count);
  }

  getCountQuestions(): Observable<number>
  {
    return this.countQuestionsLevel.asObservable();
  }

  editLevel(editLevel: Level)
  {
    const editLevelUrl =`${baseURL}/level/${editLevel.id_nivel}`;

    return this.http.patch(editLevelUrl, editLevel);
  }

  getBadges(idLevel: number|string): Observable<any[]>
  {
    const getBadgesUrl =`${baseURL}/level/${idLevel}/badges`;

    return this.http.get<any[]>(getBadgesUrl);
  }

  getBadgeSpecify(idBadge: number|string, badgeType: number)
  {
    const getBadgesUrl =`${baseURL}/badges/${idBadge}/type/${badgeType}`;

    return this.http.get<BadgeAttempts|BadgeDate|BadgeQuestions|BadgeTimer>(getBadgesUrl);
  }

  updateUsedBadges(idSubject: number, idLevel: number|string, idStudent: number|string, newValue: Array<number>): Observable<any>
  {
    const updateBadgesUrl =`${baseURL}/badges/subject/${idSubject}/level/${idLevel}/student/${idStudent}`;

    return this.http.patch(updateBadgesUrl, {"wonBadges": newValue});
  }

  createBadge(badge: any, idLevel: number) {
    const postBadgeUrl = `${baseURL}/badges/level/${idLevel}`;

    return this.http.post(postBadgeUrl, badge);
  }

  editBadge(badge: any)
  {
    const patchBadgeUrl =`${baseURL}/badge/${badge.id_insignia}`;

    return this.http.patch(patchBadgeUrl, badge);
  }

  getAvailableBadges(idLevel: number | string) {
    const getUrl =`${baseURL}/level/${idLevel}/badges/available`;

    return this.http.get<Array<{tipo_insignia: number, nombre: string}>>(getUrl);
  }

  getUsedBadges(idLevel: number | string) {
    const getUrl =`${baseURL}/level/${idLevel}/badges/used`;

    return this.http.get<Array<{tipo_insignia: number}>>(getUrl);
  }

  recieveLevelId(levelId: number)
  {
    this.PLAYING_LEVEL_ID=levelId;
  }

  sendLevelId()
  {
    return new BehaviorSubject(this.PLAYING_LEVEL_ID);
  }
}
