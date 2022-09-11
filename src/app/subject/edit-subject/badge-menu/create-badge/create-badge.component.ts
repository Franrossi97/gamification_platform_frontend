import { BadgeFactory } from './../../../../shared/BadgeFactory';
import { LevelService } from './../../../../services/level.service';
import { badgeInfo } from './../../../../shared/BadgeInformation';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { generateBadge } from '../generateBadge';

@Component({
  selector: 'app-create-badge',
  templateUrl: './create-badge.component.html',
  styleUrls: ['./create-badge.component.scss']
})
export class CreateBadgeComponent implements OnInit {

  @Input() idLevel: number;
  @Output() successfulUpdate: EventEmitter<boolean>=new EventEmitter();
  @Output() errorMessage: EventEmitter<string>=new EventEmitter();
  createBadgeForm: UntypedFormGroup;
  selectedBadgeType: number=-1;
  XIcon=faTimes;
  private availableBadges: Array<{tipo_insignia: number, nombre: string}>;

  constructor(private levelService: LevelService) { }

  ngOnInit(): void {
    this.initializeBadge();
    this.retrieveAvailableBadges();
  }

  initializeBadge() {
    this.createBadgeForm= new UntypedFormGroup({
      badgeType: new UntypedFormControl(-1),
      extra: new UntypedFormControl(0, [Validators.required]),
      parameter: new UntypedFormControl(0, [Validators.required]),
      date: new UntypedFormControl('1997-06-17'),
      perQuestion: new UntypedFormControl(false),
    });

    this.observeBadgeTypeChange();
  }

  async onCreateBadge() {

    let badgeAux= await generateBadge(
      BadgeFactory.getBadge({
        tipo_insignia: Number(this.createBadgeForm.get('badgeType').value),
        puntaje_extra: this.createBadgeForm.get('extra').value,
        preguntas_seguidas: this.createBadgeForm.get('parameter').value,
        tiempo_requerido: this.createBadgeForm.get('parameter').value,
        por_pregunta: this.createBadgeForm.get('perQuestion').value,
        hasta_dia: this.createBadgeForm.get('date').value,
        intentos_maximos: this.createBadgeForm.get('parameter').value,
      }),
      this.createBadgeForm);

    this.levelService.createBadge(badgeAux, this.idLevel).subscribe(res =>
    {
      this.onCloseWindow();
    }, err =>
    {
      this.errorMessage.emit('No se pudo crear la insignia seleccionada. Intente de nuevo.');
    });
  }

  getFormValidation() {
    let forValid= this.createBadgeForm.get('extra').valid && this.createBadgeForm.get('parameter').valid && this.createBadgeForm.get('badgeType').value != -1;

    return (this.createBadgeForm.get('badgeType').value == '2' && !this.createBadgeForm.controls['date'].value && !forValid) ||
      (this.createBadgeForm.get('badgeType').value != '2' && !forValid);
  }

  onCloseWindow()
  {
    this.successfulUpdate.emit(false);
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

  retrieveAvailableBadges() {
    this.levelService.getAvailableBadges(this.idLevel).subscribe(async resUsed =>{
      this.availableBadges=resUsed;
    });
  }

  getAvailableBadges() {
    return this.availableBadges;
  }

  observeBadgeTypeChange() {
    this.createBadgeForm.get('badgeType').valueChanges.subscribe(change =>{
      this.selectedBadgeType= Number(change);
    });
  }
}
