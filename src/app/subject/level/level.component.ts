import { DragScrollComponent } from 'ngx-drag-scroll';
import { Badge } from 'src/app/shared/Badge';
import { BadgeFactory } from './../../shared/BadgeFactory';
import { PermissionService } from './../../services/permission.service';
import { badgeInfo } from '../../shared/BadgeInformation';
import { Unit } from './../../shared/Unit';
import { UserService } from './../../services/user.service';
import { LevelService } from './../../services/level.service';
import { Level } from './../../shared/Level';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit
{
  @ViewChild('nav', {read: DragScrollComponent}) ds: DragScrollComponent;

  questionIcon = faQuestionCircle;
  SUBJECT_ID: number;
  editOpened=false;
  levels: Level[];
  actualDate: Date=new Date();
  editingLevelId = 0;
  @Input() cantStudents:number;
  //@Input() userType:number;
  @Output() newItemEvent=new EventEmitter<number>();
  canEdit = false;
  editNameForm: UntypedFormGroup;
  editUnitNameForm: UntypedFormGroup;
  newMaxScoreForm: UntypedFormGroup;
  newUnitForm: UntypedFormGroup;
  newCountQuetionsForm: UntypedFormGroup;
  showAttemptError = 0;
  showDeletePopUpId = -1;
  badgesDescriptions: Map<number, string>=new Map<number, string>();
  //badgesInfo: Map<number, string[]>;

  constructor(private router:Router, private route: ActivatedRoute, private location: Location, private levelService: LevelService,
  private userService: UserService, private fb: UntypedFormBuilder, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    if(this.editOpened)
      this.location.back();

    this.route.paramMap.subscribe(params =>
    {
      this.SUBJECT_ID=+params.get('id');
      this.getLevels(this.SUBJECT_ID);

      this.permissionService.canEdit('nivel').then(res =>
      {
        this.canEdit=res;
      });
    });
  }

  onEdit(id: number)
  {
    if(this.editOpened)
    {
      if(id == this.editingLevelId) {
        this.router.navigate([`subject/${this.SUBJECT_ID}`]);
        this.editingLevelId=0;
      }
      else {
        this.editingLevelId=id;
      }
    }
    else
    {
      this.editingLevelId=id;
    }

    this.editOpened=!this.editOpened;

  }

  getLevels(idSubject: number|string)
  {
    this.levelService.getLevelsWithVerification(idSubject, +localStorage.getItem('userId')).subscribe(levels =>
    {
      /*
      levels.forEach(level =>
      {
        this.levelService.getUnits(level.id_nivel).subscribe(res =>
        {
          level.unitList=res;
        });

        this.levelService.getAttempts(level.id_nivel, level.id_materia).subscribe(attempts =>
        {
          level.cantidad_estudiantes_intentos =attempts[0].attempsCount;
        });

        this.levelService.getBadges(level.id_nivel).subscribe(allBadges =>
        {
          level.badges=allBadges;
          this.getAllBadgesDetails(allBadges);
        })
      })*/
      this.levels=levels;

      this.levels.forEach(level =>
      {
        if(level.badges==undefined){
          level.badges= new Array<Badge>();
        }

        if(level.unitList==undefined){
          level.unitList= new Array<Unit>();
        }
      });

      console.log(this.levels);
    });
  }

  calculateDateDifference(creationDate: string): number
  {
    const dif: number=Math.abs((this.actualDate.getTime())-new Date(creationDate).getTime());
    return Math.ceil(dif/(1000 * 3600 * 24));
  }

  onChangeAvailability(indexLevel: number, idSubject: number, idLevel: number, status: boolean)
  {
    this.levelService.changeAvailability(idSubject, idLevel, status).subscribe(res =>
    {
      this.levels[indexLevel].cuestionario_disponible=!this.levels[indexLevel].cuestionario_disponible;
    }, error =>
    {
      console.log(error);
    })
  }

  onChangeretries(indexLevel: number, idLevel: number, retries: boolean)
  {
    const newLevelParams: Level=new Level();
    newLevelParams.id_nivel=idLevel;
    newLevelParams.reintentos=!retries;
    console.log(newLevelParams);

    this.levelService.editLevel(newLevelParams).subscribe(res =>
    {
      this.levels[indexLevel].reintentos=!retries;
      console.log(this.levels);
    }, err =>
    {
      console.log(err);
    });
  }

  onPlay(idLevel: number, idSubject: number, penalizacion: number, maxScore: number, countQuestions: number, retries: boolean, timesPlayed: boolean)
  {
    if(retries)
    {
      this.userService.getAttemptsofUser(idSubject, idLevel).subscribe(numberAttempts =>
      {
        this.startGame(numberAttempts, penalizacion, maxScore, countQuestions, idLevel, idSubject);
      });
    }
    else
    {
      if(timesPlayed) {
        this.showAttemptError=idLevel;
      }
      else {
        this.startGame(0, penalizacion, maxScore, countQuestions, idLevel, idSubject);
      }
      //this.allowAttempt(idLevel, idSubject, penalizacion, maxScore, countQuestions);
    }
  }

  startGame(numberAttempts: number, penalizacion: number, maxScore: number, countQuestions: number, idLevel: number, idSubject: number)
  {
    if(numberAttempts>0)
    {
      maxScore=maxScore*(penalizacion/100);
    }

    console.log(maxScore);

    this.levelService.sendMaxScore(maxScore);
    this.levelService.receiveCountQuestions(countQuestions);
    this.levelService.sendSubjectId(idSubject);
    this.router.navigate([`/level/${idLevel}/questions`]);
  }

  allowAttempt(idLevel: number, idSubject: number, penalizacion: number, maxScore: number, countQuestions: number)
  {

    this.levelService.allowAttempt(idSubject, idLevel, localStorage.getItem('userId')).subscribe(attempt =>
    {
      console.log(attempt);

      if(attempt[0].count==0 || (attempt[0].count==1 && !attempt[0].finalizado))
      {
        this.startGame(0, penalizacion, maxScore, countQuestions, idLevel, idSubject);
      }
      else
      {
        this.showAttemptError=idLevel;
      }
    });
  }

  getFormattedRecommendedDate(recommendedDate: Date): string
  {
    const auxDate=new Date(recommendedDate);
    let res = '';

    res = auxDate.getDay() > 9 ? `${auxDate.getDay()}` : `0${auxDate.getDay()}`;
    res = auxDate.getMonth() > 9 ? `${res}/${auxDate.getMonth()}` : `${res}/0${auxDate.getMonth()}`;
    res = `${res}/${auxDate.getFullYear()}`;

    return res;
  }

  getPictureLinkForBadge(badgeType: number): string
  {
    return badgeInfo.get(badgeType)[0];
  }

  getBadgeTitle(badgeType: number): string
  {
    return badgeInfo.get(badgeType)[1];
  }

  getBadgeCondition(idBadge: number)
  {
    return this.badgesDescriptions.get(idBadge);
  }

  getSpecifyBadgeInfo(idBadge: number, badgeType: number)
  {
    this.levelService.getBadgeSpecify(idBadge, badgeType).subscribe(res =>
    {
      this.badgesDescriptions.set(res.id_insignia, BadgeFactory.getBadge(res).getDescription());
    });
  }

  getAllBadgesDetails(allBadges: Array<any>)
  {
    allBadges.forEach(badge =>
    {
      this.getSpecifyBadgeInfo(badge.id_insignia, badge.tipo_insignia);
    });
  }

  onChangeLevelValue(level: Level) {
    const indexLevel = this.searchIndexLevelById(level.id_nivel);

    if(indexLevel >= 0) {
      this.levels[indexLevel] = level;
    }
  }

  onDeleteLevel(idLevel: number) {
    const indexLevel = this.searchIndexLevelById(idLevel);
    console.log(indexLevel, idLevel);

    if(indexLevel >= 0) {
      this.levels.splice(indexLevel);
    }
  }

  searchIndexLevelById(levelId: number): number {
    console.log(this.levels);

    return this.levels.findIndex(level => level.id_nivel == levelId);
  }

  scrollFirst() {
    this.ds.moveTo(0);
  }

  scrollToLast() {
    this.ds.moveTo(this.levels.length);
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  onSelectLevel(idLevel: number) {
    document.getElementById(`level${idLevel}`).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}
