import { LevelService } from './../../services/level.service';
import { Component, Input, OnInit } from '@angular/core';
import { faAngleDoubleRight, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navegation',
  templateUrl: './navegation.component.html',
  styleUrls: ['./navegation.component.scss']
})
export class NavegationComponent implements OnInit
{
  @Input() subjectName: string;
  countLevels: number;
  numberArray: number[]=new Array();
  faAngleRight=faAngleRight;
  faAngleDoubleRight=faAngleDoubleRight;

  constructor(private levelService: LevelService) { }

  ngOnInit(): void
  {
    console.log(this.subjectName);

    this.levelService.getCountLevels().subscribe(count =>
    {
      this.numberArray = Array(count).fill(0).map((x,i)=>i); // [0,1,2,3,4]
    });
  }

}
