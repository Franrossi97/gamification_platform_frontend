import { UnitService } from './unit.service';
import { LevelService } from './level.service';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {baseURL} from '../shared/baseUrl';
import {SubjectClass} from '../shared/Subject';
import { Observable, Subject } from 'rxjs';
import { Level } from '../shared/Level';

@Injectable({
  providedIn: 'root'
})
export class SubjectService
{

  private sentSubjectSource=new Subject<SubjectClass>();

  sentSubject$=this.sentSubjectSource.asObservable();
  constructor(private http: HttpClient, private levelService:LevelService, private unitService:UnitService){ }

  createSubject(newSubject: SubjectClass, idTeacher: number|string)
  {
    const postUrl:string=`${baseURL}/subjects/${idTeacher}`

    return this.http.post(postUrl, newSubject);
  }

  getSubjectsForTeacher(id:string|number): Observable<SubjectClass[]>
  {
    const getUrl=`${baseURL}/teacher/subjects/${id}`;
    console.log(getUrl);
    return this.http.get<SubjectClass[]>(getUrl);
  }

  getSubjectsForStudent(id:string|number): Observable<SubjectClass[]>
  {
    const getUrl=`${baseURL}/student/subjects/${id}`;
    console.log(getUrl);
    return this.http.get<SubjectClass[]>(getUrl);
  }

  getOneSubject(id: number|string)
  {
    const getUrl=`${baseURL}/subjects/${id}`;
    return this.http.get<SubjectClass>(getUrl);
  }

  sendRequestData(subject: SubjectClass)
  {
    this.sentSubjectSource.next(subject);
    //this.requestData(subject.id);
  }

  sendData(): Observable<SubjectClass>
  {
    return this.sentSubject$;
  }

  requestData(idSubject:number)
  {
    const getUrl=`${baseURL}/subjects/${idSubject}`;
    return this.http.get<SubjectClass>(getUrl);
  }

  getLevels(id_subject:number|string): Observable<Level[]>
  {
    return this.levelService.getLevels(id_subject);
  }

  deleteSubject(id:number|string)
  {
    const deleteUrl=`${baseURL}/subject/${id}`;
    return this.http.delete(deleteUrl);
  }
}
