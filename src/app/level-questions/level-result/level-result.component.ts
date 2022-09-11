import { Level } from 'src/app/shared/Level';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from './../../services/level.service';
import { QuestionResultService } from './../../services/question-result.service';
import { Component, OnInit } from '@angular/core';
import { cartelSpecifications } from './cartelSpecifications';

@Component({
  selector: 'app-level-result',
  templateUrl: './level-result.component.html',
  styleUrls: ['./level-result.component.scss']
})
export class LevelResultComponent implements OnInit
{
  LEVEL_ID: number;
  MAX_SCORE: number;
  finalScore: number=undefined;
  countStars=0;
  //cartelSpecifications: Map<number, infoToShow>=new Map<number, infoToShow>();
  SUBJECT_ID: number;

  constructor(private questionResultService: QuestionResultService, private levelService: LevelService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.route.parent.paramMap.subscribe(paramMap => {
      this.LEVEL_ID = +paramMap.get('id');
      this.getLevelInformation(this.LEVEL_ID);
    });
  }


  getFinalScore()
  {
    /*this.levelService.getMaxScore().subscribe(maxScore =>
    {*/
      this.questionResultService.getFinalScore().subscribe((score: number) =>
      {
        this.finalScore=Math.ceil(score);
        this.countStars= this.howManyStars(score, this.MAX_SCORE);
        /*console.log(this.finalScore);
        console.log(this.countStars);*/

      });
    //});
  }

  howManyStars(score: number, maxScore: number): number
  {
    let res:number;

    if((maxScore*0.8)<=score) {
      res=3
    }
    else {
      if((maxScore*0.8)>score && (maxScore*0.5)<=score) {
        res=2;
      }
      else {
        if(score < (maxScore*0.5) && score >= (maxScore*0.3)) {
          res = 1
        }
        else {
          res = 0;
        }
      }
    }

    return res;
  }

  getMessage(): string
  {
    return cartelSpecifications.get(this.countStars).message;
  }

  getLinkforStars(): string
  {
    return cartelSpecifications.get(this.countStars).img;
  }

  getLevelInformation(idLevel: number)
  {
    this.levelService.getOneLevel(idLevel).subscribe(async (res: Level) =>
    {
      this.SUBJECT_ID = await res.id_materia;
      this.MAX_SCORE = await res.puntaje_maximo;

      this.getFinalScore();
    });
  }
}
