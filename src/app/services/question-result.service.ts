import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionResultService
{
  finalScore: BehaviorSubject<number>;

  constructor() { }

  recieveFinalScore(score: number)
  {
    console.log(score);

    this.finalScore=new BehaviorSubject(score);
  }

  getFinalScore()
  {
    return this.finalScore.asObservable();
  }
}
