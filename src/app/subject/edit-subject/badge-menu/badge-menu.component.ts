import { BadgeTimer } from './../../../shared/BadgeTimer';
import { BadgeQuestions } from './../../../shared/BadgeQuestion';
import { BadgeDate } from './../../../shared/BadgeDate';
import { BadgeAttempts } from './../../../shared/BadgeAttempts';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LevelService } from './../../../services/level.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Badge } from 'src/app/shared/Badge';
import { badgeInfo } from 'src/app/shared/BadgeInformation';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { generateBadge } from './generateBadge';
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
  editBadgeForm: UntypedFormGroup;
  fullEditingBadge: BadgeAttempts|BadgeDate|BadgeQuestions|BadgeTimer;

  constructor(private route: ActivatedRoute, private levelService: LevelService, private fb: UntypedFormBuilder) { }

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
      extra: new UntypedFormControl(0, [Validators.required]),
      parameter: new UntypedFormControl(0, [Validators.required]),
      date: new UntypedFormControl('1997-06-17'),
      perQuestion: new UntypedFormControl(false),
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
    return this.fullEditingBadge && ((this.fullEditingBadge.tipo_insignia==2 && !this.editBadgeForm.controls['date'].value) && !this.editBadgeForm.valid);
  }

  async onUpdateBadge()
  {
    let badgeAux= await generateBadge(this.fullEditingBadge, this.editBadgeForm);

    this.levelService.editBadge(badgeAux).subscribe(res =>
    {
      this.onCloseWindow();
    }, err =>
    {
      this.errorMessage.emit('No se pudo actualizar la insignia seleccionada. Intente de nuevo.');
    });
  }

  onCloseWindow()
  {
    this.successfulUpdate.emit(false);
  }

}
