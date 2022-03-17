import { Badge } from './../shared/Badge';
import { BadgeFactory } from './BadgeFactory';
import { LevelService } from './../services/level.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {faAngleDoubleRight, faAngleDoubleLeft} from '@fortawesome/free-solid-svg-icons'
import { Level } from '../shared/Level';
import { Unit } from '../shared/Unit';

@Component({
  selector: 'app-create-level',
  templateUrl: './create-level.component.html',
  styleUrls: ['./create-level.component.scss']
})
export class CreateLevelComponent implements OnInit
{
  doubleRight=faAngleDoubleRight;
  doubleLeft=faAngleDoubleLeft;
  mostrarPrimero:boolean;
  numberUnits:number=0;
  actualPage:number=0;
  units=new Map<number,string>();
  newLevelForm: FormGroup;
  newUnitForm: FormGroup;
  allUnitsCreated:boolean;
  newLevel:Level=new Level();
  badgesForm: Array<FormGroup>=new Array(4);

  //badgeFactory: BadgeFactory;
  @ViewChild('fform') newLevelFormDirective;

  constructor(private fb: FormBuilder, private router: Router, private levelService: LevelService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.allUnitsCreated=false;
    this.mostrarPrimero=true;
    this.createLevelForm();
    this.createUnitForm();
    this.onChangesForm();
    this.badgesForm.fill(null);
  }

  createLevelForm()
  {
    this.newLevelForm=this.fb.group(
    {
      description: new FormControl(null, [Validators.minLength(0), Validators.maxLength(200)]),
      recommended_date: new FormControl(null, Validators.required),
      max_score: new FormControl(0, [Validators.required, Validators.min(1)]),
      count_questions: new FormControl(0, [Validators.required, Validators.min(1)]),
      allowAttempts: new FormControl(false),
      penalization: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      badges_checkbox: this.fb.group(
      {
        checkQuestion_uso: new FormControl(false),
        checkTimer_uso: new FormControl(false),
        checkDate_uso: new FormControl(false),
        checkAttempt_uso: new FormControl(false),
      }),
      checkQuestion: this.badgesForm[0],
      checkTimer: this.badgesForm[1],
      checkDate: this.badgesForm[2],
      checkAttempt: this.badgesForm[3],

      badges: this.fb.group(
      {
        checkQuestion: this.fb.group(
        {
          //uso: new FormControl(false),
          preguntas_seguidas: new FormControl(0, [Validators.required, Validators.min(1)]),
          valor_bonus: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]),
        }),
        checkTimer: this.fb.group(
        {
          //uso: new FormControl(false),
          max_time: new FormControl(0, [Validators.required, Validators.min(1)]),
          por_pregunta: new FormControl(false),
          valor_bonus: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]),
        }),
        checkDate: this.fb.group(
        {
          //uso: new FormControl(false),
          recommended_date: new FormControl(null, [Validators.required]),
          valor_bonus: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]),
        }),
        checkAttempt: this.fb.group(
        {
          //uso: new FormControl(false),
          max_attempts: new FormControl(0, [Validators.required, Validators.min(1)]),
          valor_bonus: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]),
        }),
      }),
      nUnits: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    });
  }

  createUnitForm()
  {
    this.newUnitForm=this.fb.group(
    {
      unitName: new FormControl(null, [Validators.maxLength(50), Validators.minLength(4), Validators.required]),
    });
  }

  onChangesForm()
  {
    this.newLevelForm.valueChanges.subscribe(values =>
    {
      //console.log(values.nUnits);

      this.numberUnits=values.nUnits;

      this.allUnitsCreated=(this.numberUnits===0);
      //console.log(this.allUnitsCreated);

    });
  }

  onRight() //Manejo el movimiento a la derecha
  {
    if(this.actualPage===0 || (this.numberUnits>0 && this.numberUnits>=this.actualPage+1))
    {
      this.actualPage++;
      this.mostrarPrimero=false;
    }
  }

  onLeft() //Manejo el movimiento a la izquierda
  {
    if(this.actualPage!==0)
    {
      this.actualPage--;
      if(this.actualPage===0)
        this.mostrarPrimero=true;
    }

  }

  onSubmitLevel()
  {
    this.loadLevelInformation();

    this.loadUnits();

    this.newLevel.badges=this.loadBadges();


    this.levelService.createLevel(this.newLevel, this.route.snapshot.params.id).subscribe(res =>
    {
      console.log(res);
      this.router.navigate([`subject/${this.route.snapshot.params.id}`]);
      window.location.reload();
    },
    err =>
    {
      console.log(err);
    })

    //console.log(this.newLevel);
  }

  onNumberUnitsChange()
  {
    this.newLevelForm.get('nUnits').valueChanges.subscribe(changes =>
    {
      //console.log(changes);
      (changes == 0) ? this.allUnitsCreated=true : this.allUnitsCreated=false;
    });
  }

  async onSubmitUnit()
  {
    this.units.set(this.actualPage, this.newUnitForm.get('unitName').value); //Incluyo nuevo nombre de unidad
    this.allUnitsCreated=await this.allUnitsSet();
    this.newUnitForm.reset();
  }

  async allUnitsSet(): Promise<boolean> //Chequeo que esten todas las unidades seteadas
  {
    let cont:boolean=true;
    let i=1;

    while(i<=this.numberUnits && cont)
    {
      if(!this.units.has(i))
      {
        cont=false;
      }
      i++
    }

    return cont;
  }

  loadLevelInformation()
  {
    this.newLevel.descripcion=this.newLevelForm.get('description').value;
    this.newLevel.fecha_recomendada_realizacion=this.newLevelForm.get('recommended_date').value;
    this.newLevel.reintentos=this.newLevelForm.get('allowAttempts').value;
    this.newLevel.penalizacion=this.newLevelForm.get('penalization').value;
    this.newLevel.puntaje_maximo=this.newLevelForm.get('max_score').value;
    this.newLevel.creado_por=+localStorage.getItem('userId').toString();
    this.newLevel.cantidad_preguntas=+this.newLevelForm.get('count_questions').value;
    this.newLevel.unitList=new Array<Unit>();
  }

  loadUnits()
  {
    this.units.forEach((value, key) =>
    {
      var newUnit=new Unit();
      newUnit.nombre=value;
      this.newLevel.unitList.push(newUnit);
    });
    //console.log(this.newLevel);
  }

  loadBadges()
  {
    let badgesArray: Array<Badge>=new Array<Badge>(4);
    badgesArray.fill(null);

    this.newLevelForm.get(`badges_checkbox.checkQuestion_uso`).value ?
    badgesArray[0]= BadgeFactory.badgeGenerator(0, this.newLevelForm.get(`badges.checkQuestion.valor_bonus`).value,
    {preguntas_seguidas: this.newLevelForm.get(`badges.checkQuestion.preguntas_seguidas`).value}) : null;

    this.newLevelForm.get(`badges_checkbox.checkTimer_uso`).value ?
    badgesArray[1]= BadgeFactory.badgeGenerator(1, this.newLevelForm.get(`badges.checkTimer.valor_bonus`).value,
    {tiempo_requerido: this.newLevelForm.get(`badges.checkTimer.max_time`).value, por_pregunta: this.newLevelForm.get(`badges.checkTimer.por_pregunta`).value}) : null;

    this.newLevelForm.get(`badges_checkbox.checkDate_uso`).value ?
    badgesArray[2]= BadgeFactory.badgeGenerator(2, this.newLevelForm.get(`badges.checkDate.valor_bonus`).value,
    {limitDate: this.newLevelForm.get(`badges.checkDate.recommended_date`).value}) : null;

    this.newLevelForm.get(`badges_checkbox.checkAttempt_uso`).value ?
    badgesArray[3]= BadgeFactory.badgeGenerator(3, this.newLevelForm.get(`badges.checkAttempt.valor_bonus`).value,
    {maxAttempts: this.newLevelForm.get(`badges.checkAttempt.max_attempts`).value}) : null;

    /*
    if(this.newLevelForm.get(`badges_checkbox.checkQuestion_uso`).value)
    {
      badgesArray[0]= BadgeFactory.badgeGenerator(0, this.newLevelForm.get(`badges.checkQuestion.valor_bonus`).value, null);
    }

    if(this.newLevelForm.get(`badges_checkbox.checkTimer_uso`).value)
    {
      badgesArray[1]= BadgeFactory.badgeGenerator(1, this.newLevelForm.get(`badges.checkTimer.valor_bonus`).value, null);
    }

    if(this.newLevelForm.get(`badges_checkbox.checkDate_uso`).value)
    {
      badgesArray[2]= BadgeFactory.badgeGenerator(2, this.newLevelForm.get(`badges.checkDate.valor_bonus`).value, null);
    }

    if(this.newLevelForm.get(`badges_checkbox.checkAttempt_uso`).value)
    {
      badgesArray[3]= BadgeFactory.badgeGenerator(3, this.newLevelForm.get(`badges.checkAttempt.valor_bonus`).value, null);
    }*/

    return badgesArray;
  }

  enableCreation(): boolean
  {
    let res: boolean;
    let resLeft: boolean=true;
    let resRight: boolean=true;
    if(this.newLevelForm.get('badges_checkbox.checkQuestion_uso').value)
    {
      resLeft=resLeft && this.newLevelForm.get('badges.checkQuestion.preguntas_seguidas').valid && this.newLevelForm.get('badges.checkQuestion.valor_bonus').valid;
    }

    if(this.newLevelForm.get('badges_checkbox.checkTimer_uso').value)
    {
      resLeft=resLeft && this.newLevelForm.get('badges.checkTimer.max_time').valid && this.newLevelForm.get('badges.checkTimer.por_pregunta').valid &&
      this.newLevelForm.get('badges.checkTimer.valor_bonus').valid;
    }

    if(this.newLevelForm.get('badges_checkbox.checkDate_uso').value)
    {
      resLeft=resLeft && this.newLevelForm.get('badges.checkDate.recommended_date').valid && this.newLevelForm.get('badges.checkDate.valor_bonus').valid;
    }

    if(this.newLevelForm.get('badges_checkbox.checkAttempt_uso').value)
    {
      resLeft=resLeft && this.newLevelForm.get('badges.checkAttempt.max_attempts').valid && this.newLevelForm.get('badges.checkAttempt.valor_bonus').valid;
    }

    res=resLeft &&

    (this.newLevelForm.get('description').valid && this.newLevelForm.get('recommended_date').valid && this.newLevelForm.get('max_score').valid &&
    this.newLevelForm.get('count_questions').valid && this.newLevelForm.get('penalization').valid && this.newLevelForm.get('allowAttempts').valid &&
    this.newLevelForm.get('nUnits').valid);

    //console.log(!res);

    return res;
  }
}
