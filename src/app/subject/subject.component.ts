import { PermissionService } from './../services/permission.service';
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
  //userType:number=0;
  subject: SubjectClass=null;
  levels:Level[];
  canEditSubject: boolean=false;
  constructor(private subjectService:SubjectService, private levelService:LevelService, private userService: UserService,
  private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      //this.getUserType(params['id']);
      this.getUserType();
      this.getWholeSubjectData(params['id']);
    })
  }

  async getUserType()
  {
    this.permissionService.canEdit('materia').then(res =>
    {
      this.canEditSubject=res;
    });
  }
/*
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
    });
  }*/

  getWholeSubjectData(idSubject: number)
  {
    this.subjectService.getOneSubject(idSubject).subscribe(res =>
    {
      this.subject=res;

      //this.getLevels(res.id_materia)
    })
  }
}
