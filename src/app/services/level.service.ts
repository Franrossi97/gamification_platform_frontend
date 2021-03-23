import { UnitService } from './unit.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseUrl';
import { Level } from '../shared/Level';
import { Unit } from '../shared/Unit';

@Injectable({
  providedIn: 'root'
})
export class LevelService
{

  levelMaxScore: BehaviorSubject<number>;
  countLevels: BehaviorSubject<number>;
  countQuestionsLevel: BehaviorSubject<number>;
  constructor(private http: HttpClient, private unitService:UnitService) { }

  getLevels(id_subject:number|string): Observable<Level[]>
  {
    const url:string=baseURL;
    return this.http.get<Level[]>(`${url}/subject/${id_subject}/levels`);
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

  getAttempts(idLevel: number|string): Observable<number>
  {
    const getAttemptsUrl: string=`${baseURL}/level/${idLevel}/attempts`;

    return this.http.get<number>(getAttemptsUrl);
  }

  changeAvailability(idLevel: number|string, status: boolean)
  {
    const patchUrl: string=`${baseURL}/level/${idLevel}/availability`;

    console.log(patchUrl);
    console.log(status);


    return this.http.patch(patchUrl, !status);
  }

  receiveCountLevels(count: number)
  {
    this.countLevels=new BehaviorSubject(count);
  }

  getCountLevels(): Observable<number>
  {
    return this.countLevels.asObservable();
  }

  sendMaxScore(maxScore: number)
  {
    this.levelMaxScore=new BehaviorSubject(maxScore);
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

  addNewAttempt(idLevel: number, idUser: number)
  {
    const postAttemptUrl:string=`${baseURL}/student/${idUser}/level/${idLevel}`;

    return this.http.post(postAttemptUrl, {});
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
}
