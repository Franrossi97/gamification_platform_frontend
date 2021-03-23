import { LevelService } from './level.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseUrl';
import { Question } from '../shared/Question';
import { Option } from '../shared/Option';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private levelService: LevelService) { }

  createQuestion(id_level: number|string, newQuestion: Question): Observable<any>
  {
    const postUrl:string=`${baseURL}/level/${id_level}/question`;

    console.log(postUrl);
    console.log(newQuestion);
    return this.http.post(postUrl, newQuestion);
  }

  getQuestions(id_level: number|string): Observable<Question[]>
  {
    const getUrl:string=`${baseURL}/level/${id_level}/questions`;

    return this.http.get<Question[]>(getUrl);
  }

  getOptionsforQuestion(idQuestion: number|string): Observable<Option[]>
  {
    const getUrl: string=`${baseURL}/question/${idQuestion}`

    return this.http.get<Option[]>(getUrl);
  }

  getMaxScore(): Observable<number>
  {
    return this.levelService.getMaxScore();
  }
}
