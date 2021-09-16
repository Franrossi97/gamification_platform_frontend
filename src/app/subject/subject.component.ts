import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { LevelService } from './../services/level.service';
import { SubjectService } from './../services/subject.service';
import { Component, Input, OnInit } from '@angular/core';
import { SubjectClass } from '../shared/Subject';
import { Level } from '../shared/Level';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit
{
  userType:number=0;
  subject: SubjectClass=null;
  levels:Level[];
  constructor(private subjectService:SubjectService, private levelService:LevelService, private userService: UserService,
  private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.getUserType();
    this.route.params.subscribe(params =>
    {
      this.getWholeSubjectData(params['id']);
    })
  }

  async getUserType()
  {
    this.userType=await this.userService.numberUserType(localStorage.getItem('userId'), this.route.snapshot.params.id);
    /*
    this.userService.numberUserType(localStorage.getItem('userId'), this.route.snapshot.params.id).subscribe((userType: number) =>
    {
      console.log('tomo tipo de usuario');
      console.log(userType);
      this.userType=userType;
    });*/
  }

  getLevels(idSubject: number)
  {
    this.subjectService.getLevels(idSubject).subscribe(levels =>
    {
      this.levels=levels;

      this.levels.forEach((level:Level) =>
      {
        this.levelService.getUnits(level.id_nivel).subscribe(units =>
        {
          level.unitList=units;
        });
      });
      console.log(`Cantidad: ${this.subject.studentsCount}`);
    });
  }

  getWholeSubjectData(idSubject: number)
  {

    this.subjectService.getOneSubject(idSubject).subscribe(res =>
    {
      console.log(res);

      this.subject=res;

      console.log(this.subject);

      this.getLevels(res.id_materia)
    })
  }
}
