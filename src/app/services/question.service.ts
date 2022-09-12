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

  createQuestion(idLevel: number|string, newQuestion: Question): Observable<any>
  {
    const postUrl =`${baseURL}/level/${idLevel}/question`;

    return this.http.post(postUrl, newQuestion);
  }

  getQuestions(idLevel: number|string): Observable<Question[]>
  {
    const getUrl =`${baseURL}/level/${idLevel}/questions`;

    return this.http.get<Question[]>(getUrl);
  }

  getOptionsforQuestion(idQuestion: number|string): Observable<Option[]>
  {
    const getUrl =`${baseURL}/question/${idQuestion}`;

    return this.http.get<Option[]>(getUrl);
  }

  getMaxScore(): Observable<number>
  {
    return this.levelService.getMaxScore();
  }

  editQuestion(idQuestion: number, newQuestion: Question)
  {
    const editQuestionUrl =`${baseURL}/question/${idQuestion}`

    return this.http.patch(editQuestionUrl, newQuestion);
  }

  editOptions(newOptions: Array<Option>)
  {
    const editUrl =`${baseURL}/question/options`;

    return this.http.patch(editUrl, newOptions);
  }

  deleteQuestion(idQuestion: number)
  {
    const deleteUrl =`${baseURL}/question/${idQuestion}`;

    return this.http.delete(deleteUrl);
  }

  getIndividualAttempts(idStudent: number, idLevel: number|string, idSubject: number): Observable<any>
  {
    //const getAttemptUrl: string=`${baseURL}/student/${idStudent}/level/${idLevel}/attempt`;
    const getAttemptUrl =`${baseURL}/student/${idStudent}/subject/${idSubject}/level/${idLevel}/attempt`;

    return this.http.get<any>(getAttemptUrl);
  }

  addNewAttempt(idSubject: number, idLevel: number|string, idUser: number)
  {
    const postAttemptUrl =`${baseURL}/student/${idUser}/subject/${idSubject}/level/${idLevel}`;

    return this.http.post(postAttemptUrl, {});
  }

  getQuestionsAfterDate(idSubject: number, idStudent: number, idLevel: number|string, date: string): Observable<any>
  {
    const getQuestionsUrl =`${baseURL}/questions/student/${idStudent}/subject/${idSubject}/level/${idLevel}/${date}`;

    return this.http.get<any>(getQuestionsUrl);
  }

  setFinishedQuestionnaire(idStudent: number|string, idSubject: number, idLevel: number|string, finalScore: number)
  {
    const patchFinishedUrl =`${baseURL}/student/${idStudent}/subject/${idSubject}/level/${idLevel}/status`;

    return this.http.patch(patchFinishedUrl, {finalScore});
  }

  addNewUsedQuestion(idSubject: number, idLevel: number|string, idStudent: number|string, idQuestion: number|string)
  {
    const postAnswerUrl =`${baseURL}/subject/${idSubject}/level/${idLevel}/student/${idStudent}/question/${idQuestion}`;

    return this.http.post(postAnswerUrl,{});
  }

  addNewAnswer(idSubject: number, idLevel: number|string, idStudent: number|string, idQuestion: number|string, result: number, dateToUse: string)
  {
    const postAnswerUrl =`${baseURL}/subject/${idSubject}/level/${idLevel}/student/${idStudent}/question/${idQuestion}`;

    return this.http.patch(postAnswerUrl, {result, dateToUse});
  }

  deleteAnswer(idSubject: number, idLevel: number|string, idStudent: number|string, idQuestion: number|string, dateToUse: string)
  {
    const deleteAnswerUrl =`${baseURL}/subject/${idSubject}/level/${idLevel}/student/${idStudent}/question/${idQuestion}/${dateToUse}`;

    return this.http.delete(deleteAnswerUrl);
  }

  getQuestion(idQuestion: number) {
    const getUrl = `${baseURL}/questions/${idQuestion}`;

    return this.http.get<Question>(getUrl);
  }
}
