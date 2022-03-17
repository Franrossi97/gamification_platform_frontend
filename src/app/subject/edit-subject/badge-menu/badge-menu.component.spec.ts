import { BadgeDate } from './../../../shared/BadgeDate';
import { BadgeTimer } from './../../../shared/BadgeTimer';
import { BadgeQuestions } from './../../../shared/BadgeQuestion';
import { LevelService } from './../../../services/level.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BadgeMenuComponent } from './badge-menu.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { BadgeAttempts } from 'src/app/shared/BadgeAttempts';

describe('BadgeMenuComponent', () => {
  let component: BadgeMenuComponent;
  let fixture: ComponentFixture<BadgeMenuComponent>;
  let levelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeMenuComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id_subject: 1}))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeMenuComponent);
    component = fixture.componentInstance;
    component.idLevel=1;
    levelService= TestBed.inject(LevelService);
    fixture.detectChanges();
  });

  it('should create', (done) => {
    spyOn(component, 'getLevelBadges');

    expect(component).toBeTruthy();

    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.getLevelBadges).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should get level badge', (done) =>
  {
    spyOn(levelService, 'getBadges').and.returnValue(of([new BadgeQuestions(1, 5, 3, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.getLevelBadges(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(levelService.getBadges).toHaveBeenCalledTimes(1);
      expect(component.badges).toEqual([new BadgeQuestions(1, 5, 3, 1)]);

      done();
    });
  });

  it('should get the whole information of the badge', (done) =>
  {
    spyOn(levelService, 'getBadgeSpecify').and.returnValue(of(new BadgeQuestions(1, 5, 3, 1)));
    spyOn(component, 'setBadgeValues');
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.badges=[new BadgeQuestions(1, 5, 3, 1), new BadgeTimer(2, 6, 20, true, 2)];

      await fixture.detectChanges();
      await fixture.whenStable();

      const badgeButton=fixture.debugElement.nativeElement.querySelector('#badgePic');
      badgeButton.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedBadgeType).toEqual(1);
      expect(component.editBadgeForm).not.toBeUndefined();
      expect(component.fullEditingBadge).toEqual(new BadgeQuestions(1, 5, 3, 1));
      expect(component.setBadgeValues).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should create the edit badge form for badge type 0', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=0;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(form.length).toEqual(2);

      done();
    });
  });

  it('should create the edit badge form for badge type 1', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(form.length).toEqual(3);

      done();
    });
  });

  it('should create the edit badge form for badge type 2', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=2;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(form.length).toEqual(2);

      done();
    });
  });

  it('should create the edit badge form for badge type 3', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=3;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(form.length).toEqual(2);

      done();
    });
  });

  it('check initial values', (done) =>
  {
    const initialValues=
    {
      extra: 0,
      parameter: 0,
      date: '1997-06-17',
      perQuestion: false,
    }

    component.createBadgeForm();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.editBadgeForm.value).toEqual(initialValues);

      done();
    });
  });

  it('check validations before changing the value of extra', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const extraInputForm= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input')[0];
      const extraValueForm= component.editBadgeForm.get('extra');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(extraInputForm.value).toEqual(String(extraValueForm.value));
      expect(extraValueForm.errors).toBeNull();

      done();
    });
  });

  it('check validations before changing the value of parameter', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const parameterInputForm= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input')[1];
      const parameterValueForm= component.editBadgeForm.get('parameter');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(parameterInputForm.value).toEqual(String(parameterValueForm.value));
      expect(parameterValueForm.errors).toBeNull();

      done();
    });
  });

  it('check validations before changing the value of date', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=2;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const dateInputForm= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input')[1];
      const dateValueForm= component.editBadgeForm.get('date');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(dateInputForm.value).toEqual(dateValueForm.value);
      expect(dateValueForm.errors).toBeNull();

      done();
    });
  });

  it('check validations before changing the value of perQuestion', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const perQuestionInputForm= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input')[2];
      const perQuestionValueForm= component.editBadgeForm.get('perQuestion');

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(perQuestionInputForm.checked).toEqual(perQuestionValueForm.value);
      expect(perQuestionValueForm.errors).toBeNull();

      done();
    });
  });

  it('check validations after changing the value of extra', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const extraInputForm= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input')[0];
      const extraValueForm= component.editBadgeForm.get('extra');

      extraInputForm.value='';
      extraInputForm.dispatchEvent(new Event('input'));
      await fixture.detectChanges();
      await fixture.whenStable();

      expect(extraInputForm.value).toEqual('');
      expect(extraValueForm.errors).not.toBeNull();
      expect(extraValueForm.errors.required).toBeTruthy();

      done();
    });
  });

  it('check validations after changing the value of parameter', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const parameterInputForm= fixture.debugElement.nativeElement.querySelector('#editBadgeForm').querySelectorAll('input')[1];
      const parameterValueForm= component.editBadgeForm.get('parameter');

      parameterInputForm.value='';
      parameterInputForm.dispatchEvent(new Event('input'));
      await fixture.detectChanges();
      await fixture.whenStable();

      expect(parameterInputForm.value).toEqual('');
      expect(parameterValueForm.errors).not.toBeNull();
      expect(parameterValueForm.errors.required).toBeTruthy();

      done();
    });
  });

  it('should set the values from the badge to the form', (done) =>
  {
    component.createBadgeForm();
    component.selectedBadgeType=1;
    component.fullEditingBadge=new BadgeTimer(1, 5, 20, true, 1);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const editBadgeForm= component.editBadgeForm;
      component.setBadgeValues();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(editBadgeForm.get('extra').value).toEqual(5);
      expect(editBadgeForm.get('parameter').value).toEqual(20);
      expect(editBadgeForm.get('perQuestion').value).toBeTrue();

      done();
    });
  });

  it('should set the values from the badge to the form', (done) =>
  {
    const dateComp=new Date();
    component.createBadgeForm();
    component.selectedBadgeType=2;
    component.fullEditingBadge=new BadgeDate(1, 5, dateComp, 2);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const editBadgeForm= component.editBadgeForm;
      component.setBadgeValues();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(editBadgeForm.get('date').value).toEqual(component.getDateParameter());

      done();
    });
  });

  it('should save the badge when pressing the button', (done) =>
  {
    spyOn(levelService, 'editBadge').and.returnValue(of(null));
    const dateComp=new Date();
    component.createBadgeForm();
    component.selectedBadgeType=2;
    component.fullEditingBadge=new BadgeDate(1, 5, dateComp, 2);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const button= fixture.debugElement.nativeElement.querySelector('#uploadBadgeChanges');
      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(levelService.editBadge).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should generate the badge to be loaded type 0', (done) =>
  {
    const dateComp=new Date();
    component.createBadgeForm();
    component.selectedBadgeType=2;
    component.fullEditingBadge=new BadgeQuestions(1, 10, 10, 0);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= component.editBadgeForm;

      form.controls['extra'].setValue(10);
      form.controls['parameter'].setValue(80);
      form.controls['perQuestion'].setValue(true);
      form.controls['date'].setValue('17/06/1997');

      const badgeToCompare=await component.generateBadge();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(badgeToCompare.id_insignia).toEqual(1);
      expect(badgeToCompare.puntaje_extra).toEqual(10);
      expect(badgeToCompare.preguntas_seguidas).toEqual(80);
      expect(badgeToCompare.tipo_insignia).toEqual(0);

      done();
    });
  });

  it('should generate the badge to be loaded type 1', (done) =>
  {
    const dateComp=new Date();
    component.createBadgeForm();
    component.selectedBadgeType=2;
    component.fullEditingBadge=new BadgeTimer(1, 10, 40, false, 1)

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= component.editBadgeForm;

      form.controls['extra'].setValue(20);
      form.controls['parameter'].setValue(80);
      form.controls['perQuestion'].setValue(true);
      form.controls['date'].setValue('17/06/1997');

      const badgeToCompare=await component.generateBadge();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(badgeToCompare.id_insignia).toEqual(1);
      expect(badgeToCompare.puntaje_extra).toEqual(20);
      expect(badgeToCompare.tiempo_requerido).toEqual(80);
      expect(badgeToCompare.por_pregunta).toEqual(true);
      expect(badgeToCompare.tipo_insignia).toEqual(1);

      done();
    });
  });

  it('should generate the badge to be loaded type 2', (done) =>
  {
    const dateComp=new Date();
    component.createBadgeForm();
    component.selectedBadgeType=2;
    component.fullEditingBadge=new BadgeDate(1, 5, dateComp, 2);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= component.editBadgeForm;

      form.controls['extra'].setValue(10);
      form.controls['parameter'].setValue(80);
      form.controls['perQuestion'].setValue(true);
      form.controls['date'].setValue('17/06/1997');

      const badgeToCompare=await component.generateBadge();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(badgeToCompare.id_insignia).toEqual(1);
      expect(badgeToCompare.puntaje_extra).toEqual(10);
      expect(badgeToCompare.hasta_dia).toEqual('17/06/1997');
      expect(badgeToCompare.tipo_insignia).toEqual(2);

      done();
    });
  });

  it('should generate the badge to be loaded type 3', (done) =>
  {
    const dateComp=new Date();
    component.createBadgeForm();
    component.selectedBadgeType=2;
    component.fullEditingBadge=new BadgeAttempts(1, 10, 2, 3);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const form= component.editBadgeForm;

      form.controls['extra'].setValue(6);
      form.controls['parameter'].setValue(3);
      form.controls['perQuestion'].setValue(true);
      form.controls['date'].setValue('17/06/1997');

      const badgeToCompare=await component.generateBadge();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(badgeToCompare.id_insignia).toEqual(1);
      expect(badgeToCompare.puntaje_extra).toEqual(6);
      expect(badgeToCompare.intentos_maximos).toEqual(3);
      expect(badgeToCompare.tipo_insignia).toEqual(3);

      done();
    });
  });
});
