import { BadgeTimer } from './../shared/BadgeTimer';
import { BadgeQuestions } from './../shared/BadgeQuestion';
import { BadgeDate } from './../shared/BadgeDate';
import { BadgeAttempts } from './../shared/BadgeAttempts';
import { Level } from './../shared/Level';
import { Badge } from './../shared/Badge';
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
  constructor(private http: HttpClient, private unitService:UnitService) { }

  getLevels(id_subject:number|string): Observable<Level[]>
  {
    const url:string=baseURL;
    return this.http.get<Level[]>(`${url}/subject/${id_subject}/levels`);
  }

  getOneLevel(idLevel: number)
  {
    const getUrl: string=`${baseURL}/level/${idLevel}`;

    return this.http.get<Level>(getUrl);
  }

  getUnits(id_level:number|string): Observable<Unit[]>
  {
    return this.unitService.getUnits(id_level);
  }

  createLevel(newLevel: Level, idSubject: number|string)
  {
    const postUrl: string=`${baseURL}/subject/${idSubject}/level`;
    console.log(newLevel);

    return this.http.post(postUrl, newLevel);
  }

  getAttempts(idLevel: number|string, idSubject: number): Observable<number>
  {
    const getAttemptsUrl: string=`${baseURL}/subject/${idSubject}/level/${idLevel}/attempts`;

    return this.http.get<number>(getAttemptsUrl);
  }

  allowAttempt(idSubject: number, idLevel: number|string, idUser: number|string)
  {
    const getBooleanAttemptUrl: string=`${baseURL}/user/${idUser}/subject/${idSubject}/level/${idLevel}/allowattempts`;

    return this.http.get(getBooleanAttemptUrl);
  }

  changeAvailability(idSubject: number, idLevel: number|string, status: boolean)
  {
    const patchUrl: string=`${baseURL}/subject/${idSubject}/level/${idLevel}/availability`;

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
    const getCountUrl: string=`${baseURL}/subject/${idSubject}/levelsamount`

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

  addNewLevelUnit(levelId: number|string, newUnit: Unit)
  {
    const newLevelUrl: string=`${baseURL}/level/${levelId}/unit`;

    return this.http.post(newLevelUrl, newUnit);
  }

  editLevel(editLevel: Level)
  {
    const editLevelUrl: string=`${baseURL}/level/${editLevel.id_nivel}`;

    return this.http.patch(editLevelUrl, editLevel);
  }

  editUnitLevelName(editUnit: Unit)
  {
    const editUnitNameUrl: string=`${baseURL}/unit/${editUnit.id_unidad}`;

    return this.http.patch(editUnitNameUrl, editUnit);
  }

  deleteUnitLevel(unitId: number|string)
  {
    const deleteUrl: string=`${baseURL}/unit/${unitId}`;

    return this.http.delete(deleteUrl);
  }

  getBadges(idLevel: number|string): Observable<any[]>
  {
    const getBadgesUrl: string=`${baseURL}/level/${idLevel}/badges`;

    return this.http.get<any[]>(getBadgesUrl);
  }

  getBadgeSpecify(idBadge: number|string, badgeType: number)
  {
    const getBadgesUrl: string=`${baseURL}/badges/${idBadge}/type/${badgeType}`;

    return this.http.get<BadgeAttempts|BadgeDate|BadgeQuestions|BadgeTimer>(getBadgesUrl);
  }

  updateUsedBadges(idLevel: number|string, idStudent: number|string, newValue: string): Observable<any>
  {
    const updateBadgesUrl: string=`${baseURL}/badges/level/${idLevel}/student/${idStudent}`;

    return this.http.patch(updateBadgesUrl, newValue);
  }

  editBadge(badge: any)
  {
    const patchBadgeUrl: string=`${baseURL}/badge/${badge.id_insignia}`;

    return this.http.patch(patchBadgeUrl, badge);
  }
}
