import { BadgeFactory } from './../../../shared/BadgeFactory';
import { BadgeTimer } from './../../../shared/BadgeTimer';
import { BadgeQuestions } from './../../../shared/BadgeQuestion';
import { BadgeDate } from './../../../shared/BadgeDate';
import { BadgeAttempts } from './../../../shared/BadgeAttempts';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LevelService } from './../../../services/level.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Badge } from 'src/app/shared/Badge';
import { badgeInfo } from 'src/app/shared/BadgeInformation';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
//import {} from '../../../../assets/img/badges/';

@Component({
  selector: 'app-badge-menu',
  templateUrl: './badge-menu.component.html',
  styleUrls: ['./badge-menu.component.scss']
})
export class BadgeMenuComponent implements OnInit {

  @Input() idLevel: number;
  @Output() successfulUpdate: EventEmitter<boolean>=new EventEmitter();
  @Output() errorMessage: EventEmitter<string>=new EventEmitter();
  XIcon=faTimes;
  badges: Array<Badge>;
  selectedBadgeType: number=-1;
  editBadgeForm: FormGroup;
  fullEditingBadge: BadgeAttempts|BadgeDate|BadgeQuestions|BadgeTimer;
  constructor(private route: ActivatedRoute, private levelService: LevelService, private fb: FormBuilder) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.getLevelBadges(this.idLevel);
      //console.log(this.idLevel);
    });
  }

  getLevelBadges(idLevel: number)
  {
    this.levelService.getBadges(idLevel).subscribe(res =>
    {
      this.badges=res;
    });
  }

  getBadgePic(badgeType: number)
  {
    return `../${badgeInfo.get(badgeType)[0]}`;
  }

  getBadgeName(badgeType: number)
  {
    return badgeInfo.get(badgeType)[1];
  }

  getParameterName(badgeType: number)
  {
    return badgeInfo.get(badgeType)[2];
  }

  onSelectBadge(badgeType: number, indexBadge: number, idBadge)
  {
    //console.log(idBadge);
    this.selectedBadgeType=badgeType;
    this.createBadgeForm();
    this.levelService.getBadgeSpecify(idBadge, badgeType).subscribe(res =>
    {
      this.fullEditingBadge=res;

      console.log(this.fullEditingBadge);

      this.setBadgeValues();
    });
  }

  createBadgeForm()
  {
    this.editBadgeForm=this.fb.group(
    {
      extra: new FormControl(0, [Validators.required]),
      parameter: new FormControl(0, [Validators.required]),
      date: new FormControl('1997-06-17'),
      perQuestion: new FormControl(false),
    });
  }

  setBadgeValues()
  {
    console.log(this.fullEditingBadge);

    this.editBadgeForm.controls['extra'].setValue(this.fullEditingBadge.puntaje_extra);

    if(this.fullEditingBadge.tipo_insignia!=2)
    {
      this.editBadgeForm.controls['parameter'].setValue(this.getParameterValue(this.fullEditingBadge.tipo_insignia));

      if(this.fullEditingBadge.tipo_insignia==1)
      {
        this.editBadgeForm.controls['perQuestion'].setValue(this.getPerQuestion());
      }
    }
    else
      this.editBadgeForm.controls['date'].setValue(this.getDateParameter());

    //console.log(this.getDateParameter);
  }

  getParameterValue(badgeType: number): number
  {
    let res: number;
    let specifyBadge: any=this.fullEditingBadge;

    if(badgeType==0)
    {
      res=specifyBadge.preguntas_seguidas;
    }
    else
    if(badgeType==1)
    {
      res=specifyBadge.tiempo_requerido;
    }
    else
    if(badgeType==3)
    {
      res=specifyBadge.intentos_maximos
    }

    return res;
  }

  getDateParameter()
  {
    let specifyBadge: any=this.fullEditingBadge, limitDate: Date;
    limitDate=new Date(specifyBadge.hasta_dia)

    return `${limitDate.getFullYear()}-${limitDate.getMonth()+1<10 ? '0'+(limitDate.getMonth()+1) : limitDate.getMonth()+1}-${limitDate.getDate()<10 ? '0'+limitDate.getDate() : limitDate.getDate()}`;
  }

  getPerQuestion(): boolean
  {
    let specifyBadge: any=this.fullEditingBadge;

    return specifyBadge.por_pregunta;
  }

  getFormValidation(): boolean
  {
    //console.log(this.editBadgeForm.controls['date'].value);

    return this.fullEditingBadge && ((this.fullEditingBadge.tipo_insignia==2 && !this.editBadgeForm.controls['date'].value) && !this.editBadgeForm.valid);
  }

  async onUpdateBadge()
  {
    let badgeAux= await this.generateBadge();

    this.levelService.editBadge(badgeAux).subscribe(res =>
    {
      this.successfulUpdate.emit(false);
    }, err =>
    {
      this.errorMessage.emit('No se pudo actualizar la insignia seleccionada. Intente de nuevo.');
    });
  }

  async generateBadge()
  {
    let badgeAux: any=this.fullEditingBadge;

    badgeAux.puntaje_extra=this.editBadgeForm.get('extra').value;
    if(this.fullEditingBadge.tipo_insignia==0)
    {
      badgeAux.preguntas_seguidas=this.editBadgeForm.get('parameter').value;
    }
    else
    if(this.fullEditingBadge.tipo_insignia==1)
    {
      badgeAux.tiempo_requerido=this.editBadgeForm.get('parameter').value;
      badgeAux.por_pregunta=this.editBadgeForm.get('perQuestion').value;
    }
    else
    if(this.fullEditingBadge.tipo_insignia==2)
    {
      badgeAux.hasta_dia=this.editBadgeForm.get('date').value;
    }
    else
    if(this.fullEditingBadge.tipo_insignia==3)
    {
      badgeAux.intentos_maximos=this.editBadgeForm.get('parameter').value;
    }

    return badgeAux;
  }

  onCloseWindow()
  {
    this.successfulUpdate.emit(false);
  }

}
