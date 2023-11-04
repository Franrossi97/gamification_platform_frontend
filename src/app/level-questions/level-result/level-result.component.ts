import { UserService } from './../../services/user.service';
import { Level } from 'src/app/shared/Level';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from './../../services/level.service';
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

  constructor(private userService : UserService, private levelService: LevelService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.route.parent.paramMap.subscribe(paramMap => {
      this.LEVEL_ID = +paramMap.get('id');
      this.getLevelInformation(this.LEVEL_ID);
    });
  }


  getFinalScore()
  {
    this.userService.getUserGameScore(localStorage.getItem('userId'), this.LEVEL_ID, this.SUBJECT_ID).subscribe((score: {puntaje_final: number}) => {
      this.finalScore = score.puntaje_final;
      this.countStars= this.howManyStars(this.finalScore, this.MAX_SCORE);
    });
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
