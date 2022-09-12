import { UnitService } from './unit.service';
import { LevelService } from './level.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {baseURL} from '../shared/baseUrl';
import {SubjectClass} from '../shared/Subject';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Level } from '../shared/Level';

@Injectable({
  providedIn: 'root'
})
export class SubjectService
{

  private sentSubjectSource: SubjectClass;

  constructor(private http: HttpClient, private levelService:LevelService, private unitService:UnitService){ }

  createSubject(newSubject: SubjectClass, idTeacher: number|string)
  {
    const postUrl:string=`${baseURL}/subjects/${idTeacher}`

    return this.http.post(postUrl, newSubject);
  }

  getSubjectsForTeacher(id:string|number, offset: number, limit: number): Observable<SubjectClass[]>
  {
    const getUrl=`${baseURL}/teacher/subjects/${id}/${offset}/${limit}`;

    return this.http.get<SubjectClass[]>(getUrl);
  }

   getSubjectsForStudent(id:string|number, offset: number, limit: number): Observable<SubjectClass[]>
  {
    const getUrl=`${baseURL}/student/subjects/${id}/${offset}/${limit}`;

    return this.http.get<SubjectClass[]>(getUrl);
  }

  getOneSubject(id: number|string)
  {
    const getUrl=`${baseURL}/subjects/${id}`;

    return this.http.get<SubjectClass>(getUrl);
  }

  sendRequestData(): Observable<SubjectClass>
  {
    const subjectToSend: BehaviorSubject<SubjectClass>=new BehaviorSubject<SubjectClass>(this.sentSubjectSource);

    return subjectToSend.asObservable();
  }

  sendData(subject: SubjectClass)
  {
    this.sentSubjectSource=subject;
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

  showSubject(id: number)
  {
    const patchUrl: string=`${baseURL}/subject/${id}/show`;

    return this.http.patch(patchUrl, {});
  }

  hideSubject(id: number)
  {
    const patchUrl: string=`${baseURL}/subject/${id}/hide`;

    return this.http.patch(patchUrl, {});
  }

  restoreSubject(idSubject: number)
  {
    const patchUrl: string=`${baseURL}/subject/${idSubject}`;

    return this.http.patch(patchUrl, {});
  }

  getSubjectBySearch(searchWord: string, idStudent: number): Observable<Array<SubjectClass>>
  {
    const getSearchUrl: string=`${baseURL}/subject/search/${searchWord}/user/${idStudent}`

    console.log(getSearchUrl);

    return this.http.get<Array<SubjectClass>>(getSearchUrl);
  }

  getSubjectBySearchWithOutLimit(searchWord: string, quarter: number, year: number): Observable<Array<SubjectClass>>
  {
    const getSearchUrl = `${baseURL}/subject/search/${searchWord}/${quarter}/${year}`;

    return this.http.get<Array<SubjectClass>>(getSearchUrl);
  }

  copyLevels(idSubject: number, idSubjectCopy: number)
  {
    const postUrl: string= `${baseURL}/subject/${idSubject}/copy/${idSubjectCopy}`;

    return this.http.post(postUrl, {});
  }

  uploadCoverImage(name: string, img)
  {
    const postImgUrl: string=`${baseURL}/subject/picture/${name}`;
    const formData= new FormData();
    formData.append('cover', img);

    return this.http.post(postImgUrl, img);
  }

  getSubjectPagination(userId: number, userType: number){
    const getUrl: string= `${baseURL}/subjects/pagination/${userId}/${userType}`;

    return this.http.get<{total: number, per_page: number}>(getUrl);
  }

  getCoverImages(imageNameOfSubjectId: Array<number>){
    const getUrl: string= `${baseURL}/subjects/picture`;

    return this.http.post<Array<{subjectId: number, image: any}>>
      (getUrl, imageNameOfSubjectId);
  }
}
