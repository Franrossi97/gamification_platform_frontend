import { Level } from 'src/app/shared/Level';
import { PermissionService } from './../services/permission.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { LevelService } from './../services/level.service';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit } from '@angular/core';
import { SubjectClass } from '../shared/Subject';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit
{
  ID_SUBJECT: number;
  PROGRESS = 0;
  levels: Array<Level>;
  subject: SubjectClass=null;
  canEditSubject = false;
  score = 0;

  constructor(private subjectService:SubjectService, private levelService:LevelService, private userService: UserService,
  private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.ID_SUBJECT= params['id'];
      this.getUserType();
      this.getWholeSubjectData(this.ID_SUBJECT);
      this.getUserScore();
      this.getLevels();
    })
  }

  getUserType()
  {
    this.permissionService.canEdit('materia').then(res =>
    {
      this.canEditSubject=res;
    });
  }

  getUserScore() {
    this.userService.getUserScore(this.ID_SUBJECT, localStorage.getItem('userId')).subscribe(res => {
      this.score = res.puntaje_tot;
    });
  }

  getWholeSubjectData(idSubject: number)
  {
    this.subjectService.getOneSubject(idSubject).subscribe(res =>
    {
      this.subject=res;
    })
  }

  getLevels() {
    this.levelService.getLevelsWithVerification(this.ID_SUBJECT, +localStorage.getItem('userId')).subscribe(res => {
      this.levels = res;

      this.calculateProgress();
    });
  }

  calculateProgress() {
    const totLevels = this.levels.length;
    const answeredLevels = this.levels.filter(level => level.timesPlayed).length

    if(totLevels == 0) {
      this.PROGRESS = 0
    } else {
      this.PROGRESS = Math.round((answeredLevels/totLevels)*100);
    }
  }

  getProgressWidth() {
    return `width: ${this.PROGRESS}%`;
  }
}
