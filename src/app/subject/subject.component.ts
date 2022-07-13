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
  ID_SUBJECT: number;
  //userType:number=0;
  subject: SubjectClass=null;
  levels:Level[];
  canEditSubject: boolean=false;
  score: number=0;

  constructor(private subjectService:SubjectService, private levelService:LevelService, private userService: UserService,
  private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.ID_SUBJECT= params['id'];
      //this.getUserType(params['id']);
      this.getUserType();
      this.getWholeSubjectData(this.ID_SUBJECT);
      this.getUserScore();
    })
  }

  async getUserType()
  {
    this.permissionService.canEdit('materia').then(res =>
    {
      this.canEditSubject=res;
    });
  }

  async getUserScore() {
    this.userService.getUserScore(this.ID_SUBJECT, +localStorage.getItem('userId')).subscribe(res => {
      this.score = res.puntaje_tot;
    });
  }

  getWholeSubjectData(idSubject: number)
  {
    this.subjectService.getOneSubject(idSubject).subscribe(res =>
    {
      this.subject=res;

      //this.getLevels(res.id_materia)
    })
  }
}
