import { Unit } from '../../../shared/Unit';
import { UnitService } from '../../../services/unit.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Level } from 'src/app/shared/Level';
import { LevelService } from '../../../services/level.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-edit-level-information',
  templateUrl: './edit-level-information.component.html',
  styleUrls: ['./edit-level-information.component.scss']
})
export class EditLevelInformationComponent implements OnInit {

  @Input() idLevel: number;
  @Output() levelChangeEvent: EventEmitter<Level>= new EventEmitter<Level>();
  level: Level;
  selectedUnitId: number;
  private editLevelInformationForm: UntypedFormGroup = undefined;
  private editUnitInformationFrom: UntypedFormGroup;
  private newUnitForm: UntypedFormGroup = undefined
  editIcon = faEdit;
  trashIcon = faTrash;

  constructor(private fb: UntypedFormBuilder, private levelService: LevelService, private unitService: UnitService) { }

  ngOnInit(): void {
    this.getLevelInformation();
  }

  getLevelInformation() {
    this.levelService.getOneLevel(this.idLevel).subscribe(res => {
      this.level = res;

      this.levelService.getUnits(this.idLevel).subscribe(units => {
        this.level.unitList = units;

        this.createEditLevelForm();
        this.createNewUnitForm();
      });
    });
  }

  createEditLevelForm() {
    this.editLevelInformationForm = this.fb.group({
      name: new UntypedFormControl(this.level.descripcion, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
      score: new UntypedFormControl(this.level.puntaje_maximo, [Validators.required, Validators.min(0)]),
      maxQuestions: new UntypedFormControl(this.level.cantidad_preguntas, [Validators.required, Validators.min(0)]),
    });
  }

  createNewUnitForm() {
    this.newUnitForm = this.fb.group({
      unitName: new UntypedFormControl(null, [Validators.required, Validators.min(1), Validators.max(50)])
    });
  }

  createEditUnitForm(unitId: number, unitIndex: number) {
    this.editUnitInformationFrom = this.fb.group({
      unitName: new UntypedFormControl(this.level.unitList[unitIndex].nombre, [Validators.required, Validators.min(1), Validators.max(50)])
    });

    this.selectedUnitId = unitId;
  }


  onSubmitNewLevelValues() {
    const newLevelValue: Level=this.level;
    newLevelValue.descripcion = this.editLevelInformationForm.get('name').value;
    newLevelValue.puntaje_maximo = this.editLevelInformationForm.get('score').value;
    newLevelValue.cantidad_preguntas=this.editLevelInformationForm.get('maxQuestions').value;

    this.levelService.editLevel(newLevelValue).subscribe(res =>
    {
      this.levelChangeEvent.emit(newLevelValue);
    }, err =>
    {
      console.log(err);
    });
  }

  onCancel() {

  }

  onDeleteUnit(unitId: number|string, unitIndex: number)
  {
    this.unitService.deleteUnitLevel(unitId).subscribe(res =>
    {
      this.level.unitList.splice(unitIndex, 1);
      this.levelChangeEvent.emit(this.level);
    },err =>
    {
      console.log(err);
    });
  }

  onSubmitNewUnit()
  {
    const newUnit = new Array<Unit>();
    newUnit.push(new Unit(undefined, this.newUnitForm.get('unitName').value));

    this.unitService.addNewLevelUnit(this.idLevel, newUnit).subscribe(res =>
    {
      this.onCancelNewUnit();
      newUnit[0].id_unidad = res;
      this.level.unitList.push(newUnit[0]);
      this.levelChangeEvent.emit(this.level);
      this.selectedUnitId = -1;
    },err =>
    {
      console.log(err);
    });
  }

  onEditUnitValue(idUnit: NumberSymbol, unitIndex: number) {
    const unit = new Unit(idUnit, this.editUnitInformationFrom.get('unitName').value);

    this.level.unitList[unitIndex].nombre = unit.nombre;
    this.unitService.editUnitLevelName(unit).subscribe(res => {
      this.levelChangeEvent.emit(this.level);
    }, err => {

    });
  }

  getEditLevelForm() {
    return this.editLevelInformationForm;
  }

  getEditUnitFrom() {
    return this.editUnitInformationFrom;
  }

  getCreateNewUnitForm() {
    return this.newUnitForm;
  }

  cancelEditName() {
    this.selectedUnitId = -1;
  }

  onCancelNewUnit() {
    this.newUnitForm.reset();
  }

  onCancelEditLevel() {
    //this.editLevelInformationForm.reset();
    this.createEditLevelForm();
  }
}
