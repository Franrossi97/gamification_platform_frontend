import { Badge } from 'src/app/shared/Badge';
import { BadgeFactory } from './../../shared/BadgeFactory';
import { PermissionService } from './../../services/permission.service';
import { badgeInfo } from '../../shared/BadgeInformation';
import { Unit } from './../../shared/Unit';
import { UserService } from './../../services/user.service';
import { LevelService } from './../../services/level.service';
import { Level } from './../../shared/Level';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Location} from '@angular/common';
import {faEdit, faPlus, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit
{
  SUBJECT_ID: number;
  editOpened=false;
  levels: Level[];
  actualDate: Date=new Date();
  editingLevelId:number=0;
  editIcon=faEdit;
  plusIcon=faPlus;
  trashIcon=faTrashAlt;
  @Input() cantStudents:number;
  //@Input() userType:number;
  @Output() newItemEvent=new EventEmitter<number>();
  canEdit: boolean=false;
  editNameForm: FormGroup;
  editUnitNameForm: FormGroup;
  newMaxScoreForm: FormGroup;
  newUnitForm: FormGroup;
  newCountQuetionsForm: FormGroup;
  showEditName: number=0;
  showEditUnit: number=0;
  showNewUnit: number=0;
  showNewScore: number=0;
  showNewCountQuestions: number=0;
  showAttemptError: number=0;
  showDeletePopUpId: number=-1;
  badgesDescriptions: Map<number, string>=new Map<number, string>();
  //badgesInfo: Map<number, string[]>;

  constructor(private router:Router, private route: ActivatedRoute, private location: Location, private levelService: LevelService,
  private userService: UserService, private fb: FormBuilder, private permissionService: PermissionService) { }

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
      this.router.navigate([`subject/${this.SUBJECT_ID}`]);
      this.editingLevelId=0;
      //this.location.back();
    }
    else
    {
      this.editingLevelId=id;
    }

    this.editOpened=!this.editOpened;

  }

  getLevels(idSubject: number|string)
  {
    this.levelService.getLevels(idSubject).subscribe(levels =>
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
    let dif: number=Math.abs((this.actualDate.getTime())-new Date(creationDate).getTime());
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
    let newLevelParams: Level=new Level();
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

  onPlay(idLevel: number, idSubject: number, penalizacion: number, maxScore: number, countQuestions: number, retries: boolean)
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
      this.allowAttempt(idLevel, idSubject, penalizacion, maxScore, countQuestions);
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

  onEditName(idLevel: number)
  {
    this.showEditName=idLevel;
    this.editNameForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    });
  }

  onSubmitNewName(idLevel: number)
  {
    let editedLevel=new Level();

    editedLevel.id_nivel=idLevel;
    editedLevel.descripcion=this.editNameForm.get('name').value;
    console.log(editedLevel);
    this.levelService.editLevel(editedLevel).subscribe(res =>
    {
      this.cancelEditName();
    },err =>
    {
      console.log(err);
    });
  }

  cancelEditName()
  {
    this.showEditName=0;
    this.editNameForm=null;
  }

  onEditNameUnit(idUnit: number)
  {
    this.showEditUnit=idUnit;
    this.editUnitNameForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    });
  }

  onSubmitNewUnitName(idUnit: number)
  {
    let editedUnit=new Unit();

    editedUnit.id_unidad=idUnit;
    editedUnit.nombre=this.editUnitNameForm.get('name').value;
    this.editUnitNameForm.reset();
  }

  cancelEditUnitName()
  {
    this.showEditUnit=0;
    this.editUnitNameForm=null;
  }

  onDeleteUnit(unitId: number|string, levelIndex: number)
  {
    this.levelService.deleteUnitLevel(unitId).subscribe(res =>
    {
      console.log(res);
      let i: number=0;
      this.levels[levelIndex].unitList.every(unit =>
      {
        i++;
        return unit.id_unidad!=unitId
      });

      this.levels[levelIndex].unitList.splice(i, 1);
      this.cancelEditName();
    },err =>
    {
      console.log(err);
    });
  }

  onAddNewUnit(idLevel: number|string)
  {
    this.showNewUnit=+idLevel;
    this.newUnitForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    });
  }

  onSubmitNewUnit(idLevel: number, levelIndex: number)
  {
    let newUnit: Unit=new Unit();
    newUnit.nombre=this.newUnitForm.get('name').value;
    this.editNameForm.reset();
    this.levelService.addNewLevelUnit(idLevel, newUnit).subscribe(res =>
    {
      this.levels[levelIndex].unitList.push(newUnit);
      this.cancelNewUnit();
    },err =>
    {
      console.log(err);

    });
  }

  cancelNewUnit()
  {
    this.showNewUnit=0;
    this.newUnitForm=null;
  }

  onEditScore(idLevel: number)
  {
    this.showNewScore=idLevel;
    this.newMaxScoreForm=this.fb.group(
    {
      score: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  onEditCountQuestions(idLevel: number)
  {
    this.showNewCountQuestions=idLevel;
    this.newCountQuetionsForm=this.fb.group(
    {
      count: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
  }

  cancelNewCountQuestion()
  {
    this.showNewCountQuestions=0;
    this.newCountQuetionsForm=null;
  }

  onSubmitNewCountQuestions(idLevel: number, levelIndex: number)
  {
    let newLevelValue: Level=new Level();
    newLevelValue.id_nivel=idLevel;
    newLevelValue.cantidad_preguntas=this.newCountQuetionsForm.get('count').value;
    this.newCountQuetionsForm.reset;
    this.levelService.editLevel(newLevelValue).subscribe(res =>
    {
      this.levels[levelIndex].cantidad_preguntas=newLevelValue.cantidad_preguntas;
      this.cancelNewCountQuestion();
    }, err =>
    {
      console.log(err);
    });
  }

  onSubmitNewScore(idLevel: number, levelIndex: number)
  {
    let newLevelValue: Level=new Level();
    newLevelValue.id_nivel=idLevel;
    newLevelValue.puntaje_maximo=this.newMaxScoreForm.get('score').value;
    this.newMaxScoreForm.reset;
    this.levelService.editLevel(newLevelValue).subscribe(res =>
    {
      this.levels[levelIndex].puntaje_maximo=newLevelValue.puntaje_maximo;
      this.cancelNewScore()
    },err =>
    {
      console.log(err);
    });
  }

  cancelNewScore()
  {
    this.showNewScore=0
    this.newMaxScoreForm=null;
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
    let auxDate=new Date(recommendedDate);

    return `${auxDate.getDay()}/${auxDate.getMonth()}/${auxDate.getFullYear()}`;
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

  showDeleteLevelMenu(idLevel: number)
  {
    this.showDeletePopUpId=idLevel;
  }

  deleteLevel(idLevel: number)
  {
    const indexDelete=this.levels.findIndex(item =>
    {
      item.id_nivel==idLevel;
    });

    this.levelService.deleteLevel(idLevel).subscribe(res =>
    {
      this.levels.splice(indexDelete);
    }, err =>
    {

    });
  }

  cancelDeleteLevel()
  {
    this.showDeletePopUpId=-1;
  }

}
