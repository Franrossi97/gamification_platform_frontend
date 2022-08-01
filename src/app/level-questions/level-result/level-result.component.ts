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
  finalScore: number=undefined;
  countStars=0;
  //cartelSpecifications: Map<number, infoToShow>=new Map<number, infoToShow>();
  RETRIES: boolean;
  SUBJECT_ID: number;

  constructor(private questionResultService: QuestionResultService, private levelService: LevelService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(async params =>
    {
      await this.levelService.sendLevelId().subscribe(id =>
      {
        this.LEVEL_ID=id;
        this.getLevelInformation(this.LEVEL_ID);
      });

      //this.initializecartelSpecifications();

      this.getFinalScore();
    });
  }


  getFinalScore()
  {
    this.levelService.getMaxScore().subscribe(maxScore =>
    {
      this.questionResultService.getFinalScore().subscribe((score: number) =>
      {
        this.finalScore=Math.ceil(score);
        this.countStars=this.howManyStars(score, maxScore);
        /*console.log(this.finalScore);
        console.log(this.countStars);*/

      });
    });
  }
/*
  initializecartelSpecifications()
  {
    this.cartelSpecifications.set(1,
    {
      img: "../../../assets/img/result_background/stars1.png",
      message: 'MAL',
    });
    this.cartelSpecifications.set(2,
    {
      img: "../../../assets/img/result_background/stars2.png",
      message: 'MUY BIEN',
    });
    this.cartelSpecifications.set(3,
    {
      img: "../../../assets/img/result_background/stars3.png",
      message: 'EXCELENTE',
    });
  }*/

  howManyStars(score: number, maxScore: number): number
  {
    let res:number;
    if((maxScore*0.8)<=score)
    {
      res=3
    }
    else
    if((maxScore*0.8)>score && (maxScore*0.5)<=score)
    {
      res=2;
    }
    else
    {
      res=1;
    }

    return res;
  }

  getMessage(): string
  {
    return cartelSpecifications.get(this.countStars).message;
  }

  getLinkforStars(): string
  {
    //console.log(cartelSpecifications);
    return cartelSpecifications.get(this.countStars).img;
  }

  getLevelInformation(idLevel: number)
  {
    this.levelService.getOneLevel(idLevel).subscribe((res: Level) =>
    {
      this.SUBJECT_ID=res.id_materia;
      this.RETRIES=!!res.reintentos;
    });
  }
}
