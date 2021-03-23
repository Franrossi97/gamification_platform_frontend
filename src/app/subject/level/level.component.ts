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

  editOpened=false;
  levels: Level[];
  actualDate: Date=new Date();
  editingLevelId:number=0;
  editIcon=faEdit;
  plusIcon=faPlus;
  trashIcon=faTrashAlt;
  @Input() cantStudents:number;
  @Input() userType:number;
  @Output() newItemEvent=new EventEmitter<number>();
  editNameForm: FormGroup;
  editUnitNameForm: FormGroup;
  newMaxScoreForm: FormGroup;
  newUnitForm: FormGroup;
  showEditName: number=0;
  showEditUnit: number=0;
  showNewUnit: number=0;
  showNewScore: number=0;
  constructor(private router:Router, private route: ActivatedRoute, private location: Location, private levelService: LevelService,
  private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void
  {
    if(this.editOpened)
      this.location.back();

    this.route.paramMap.subscribe(params =>
    {
      this.getLevels(params.get('id'));
    });
  }

  onEdit(id: number)
  {
    if(this.editOpened)
    {
      this.router.navigate([`subject/${this.route.snapshot.params.id}`]);
      this.editingLevelId=0;
      //this.location.back();
    }
    else
    {
      this.editingLevelId=id;
    }
    /*
    else
    {
      this.router.navigate(['level/1'],{relativeTo: this.route})
    }
    */
    this.editOpened=!this.editOpened;

  }

  getLevels(idSubject: number|string)
  {
    this.levelService.getLevels(idSubject).subscribe(levels =>
    {
      levels.forEach(level =>
      {
        this.levelService.getUnits(level.id_nivel).subscribe(res =>
        {
          level.unitList=res;
        });

        this.levelService.getAttempts(level.id_nivel).subscribe(attempts =>
        {
          level.cantidad_estudiantes_intentos =attempts[0].attempsCount;
        });
      })
      this.levels=levels;
      console.log(this.levels);
      this.sendNumberOfLevels(this.levels.length);
    });
  }

  calculateDateDifference(creationDate: string): number
  {
    let dif: number=Math.abs((this.actualDate.getTime())-new Date(creationDate).getTime());
    return Math.ceil(dif/(1000 * 3600 * 24));
  }

  onChangeAvailability(indexLevel: number, idLevel: number, status: boolean)
  {
    console.log(status);

    this.levelService.changeAvailability(idLevel, status).subscribe(res =>
    {
      console.log(res);
      console.log(status);

      this.levels[indexLevel].cuestionario_disponible=!this.levels[indexLevel].cuestionario_disponible;
      console.log(this.levels);


    }, error =>
    {
      console.log(error);

    })
  }

  onPlay(idLevel: number, penalizacion: number, maxScore: number, countQuestions: number)
  {
    this.userService.getAttemptsofUser(idLevel).subscribe(numberAttempts =>
    {
      if(numberAttempts>0)
      {
        console.log(maxScore);

        maxScore=maxScore*(penalizacion/100);
      }

      console.log(maxScore);

      this.levelService.sendMaxScore(maxScore);
      this.levelService.receiveCountQuestions(countQuestions)
      this.router.navigate([`/level/${idLevel}/questions`])
    });
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
    this.levelService.editLevel(editedLevel)
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

  onDeleteUnit(unitId: number|string)
  {
    this.levelService.deleteUnitLevel(unitId);
  }

  onAddNewUnit(idLevel: number|string)
  {
    this.showNewUnit=+idLevel;
    this.newUnitForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    });
  }

  onSubmitNewUnit(idLevel: number)
  {
    let newUnit: Unit=new Unit();
    newUnit.nombre=this.newUnitForm.get('name').value;
    this.editNameForm.reset();
    this.levelService.addNewLevelUnit(idLevel, newUnit);
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

  onSubmitNewScore(idLevel: number)
  {
    let newLevelValue: Level=new Level();
    newLevelValue.id_nivel=idLevel;
    newLevelValue.puntaje_maximo=this.newMaxScoreForm.get('score').value;
    this.newMaxScoreForm.reset;
    this.levelService.editLevel(newLevelValue);
  }

  cancelNewScore()
  {
    this.showNewScore=0
    this.newMaxScoreForm=null;
  }

  sendNumberOfLevels(countLevel: number)
  {
    this.levelService.receiveCountLevels(countLevel);
  }

}
