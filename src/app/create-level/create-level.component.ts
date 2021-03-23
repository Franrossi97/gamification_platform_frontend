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
  @ViewChild('fform') newLevelFormDirective;

  constructor(private fb: FormBuilder, private router: Router, private levelService: LevelService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.allUnitsCreated=false;
    this.mostrarPrimero=true;
    this.createLevelForm();
    this.createUnitForm();
    this.onChangesForm();
  }

  createLevelForm()
  {
    this.newLevelForm=this.fb.group(
    {
      description: new FormControl(null, [Validators.minLength(0), Validators.maxLength(200)]),
      recommended_date: new FormControl(null, Validators.required),
      max_score: new FormControl(null, [Validators.required, Validators.min(0)]),
      count_questions: new FormControl(0, [Validators.required, Validators.min(0)]),
      penalization: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
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
    this.newLevel.descripcion=this.newLevelForm.get('description').value;
    this.newLevel.fecha_recomendada_realizacion=this.newLevelForm.get('recommended_date').value;
    this.newLevel.penalizacion=this.newLevelForm.get('penalization').value;
    this.newLevel.puntaje_maximo=this.newLevelForm.get('max_score').value;
    this.newLevel.creado_por=+localStorage.getItem('userId').toString();
    this.newLevel.cantidad_preguntas=+this.newLevelForm.get('count_questions').value;
    this.newLevel.unitList=new Array<Unit>();

    this.units.forEach((value, key) =>
    {
      var newUnit=new Unit();
      newUnit.nombre=value;
      this.newLevel.unitList.push(newUnit);
    });

    this.levelService.createLevel(this.newLevel, this.route.snapshot.params.id).subscribe(res =>
    {
      console.log(res);
      this.router.navigate([`subject/${this.route.snapshot.params.id}`]);
    },
    err =>
    {
      console.log(err);
    })
  }

  onSubmitUnit()
  {
    this.units.set(this.actualPage, this.newUnitForm.get('unitName').value); //Incluyo nuevo nombre de unidad
    this.allUnitsCreated=this.AllUnitsSet();
    this.newUnitForm.reset();
  }

  AllUnitsSet(): boolean //Chequeo que esten todas las unidades seteadas
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
}
