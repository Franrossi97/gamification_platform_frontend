import { BadgeAttempts } from './../shared/BadgeAttempts';
import { BadgeDate } from './../shared/BadgeDate';
import { BadgeTimer } from './../shared/BadgeTimer';
import { BadgeQuestions } from './../shared/BadgeQuestion';
import { Badge } from 'src/app/shared/Badge';
import { LevelService } from './../services/level.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { CreateLevelComponent } from './create-level.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';

describe('CreateLevelComponent', () => {
  let component: CreateLevelComponent;
  let fixture: ComponentFixture<CreateLevelComponent>;
  let levelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLevelComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.setItem('userId', '1');
  });

  it('should create and initialization values', () => {
    expect(component).toBeTruthy();
    expect(component.allUnitsCreated).not.toBeTrue();
    expect(component.mostrarPrimero).toBeTrue();
  });

  it('should create the create level form', (done) =>
  {
    const badgeQuestion: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-question"]`);
    const badgeTimer: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-timer"]`);
    const badgeDate: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-date"]`);
    const badgeAttempt: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-attempt"]`);

    badgeQuestion.click(); badgeTimer.click(); badgeDate.click(); badgeAttempt.click();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const formInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input');
      expect(formInputElement.length).toEqual(20);

      done();
    });

  });

  it('check initial values for form group', () =>
  {
    const createLevelFormGroup= component.newLevelForm;
    const creatLevelValues=
    {
      description: null,
      recommended_date: null,
      max_score: 0,
      count_questions: 0,
      penalization: 0,
      badges_checkbox:
      {
        checkQuestion_uso: false,
        checkTimer_uso: false,
        checkDate_uso: false,
        checkAttempt_uso: false,
      },
      checkAttempt: null,
      checkDate:null,
      checkQuestion:null,
      checkTimer:null,
      badges:
      {
        checkQuestion:
        {
          preguntas_seguidas: 0,
          valor_bonus: 0
        },
        checkTimer:
        {
          max_time: 0,
          por_pregunta: false,
          valor_bonus: 0,
        },
        checkDate:
        {
          recommended_date: null,
          valor_bonus: 0,
        },
        checkAttempt:
        {
          max_attempts: 0,
          valor_bonus: 0,
        }
      },
      allowAttempts: false,
      nUnits: null
    }

    expect(createLevelFormGroup.value).toEqual(creatLevelValues);
  });

  it('check description value before enter some value', () =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[0];
    const descriptionFormGroup= component.newLevelForm.get('description');

    expect(formInputElement.value).toEqual(descriptionFormGroup.value==null ? '' : descriptionFormGroup.value);
  });

  it('check description value after enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[0];
    const descriptionFormGroup= component.newLevelForm.get('description');

    formInputElement.value='Test';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(formInputElement.value).toEqual(descriptionFormGroup.value);

      done();
    });

  });

  it('check recommended_date value before enter some value', () =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[1];
    const recommended_dateFormGroup= component.newLevelForm.get('recommended_date');

    expect(formInputElement.value).toEqual(recommended_dateFormGroup.value==null ? '' : recommended_dateFormGroup.value);
    expect(recommended_dateFormGroup.errors).not.toBeNull();
    expect(recommended_dateFormGroup.errors.required).toBeTruthy();
  });

  //TESTING CON DATE IMPOSIBLE
  /*
  it('check recommended_date value after enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[1];
    const recommended_dateFormGroup= component.newLevelForm.get('recommended_date');

    formInputElement.value='17/06/1997';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      console.log('aqui', formInputElement.value, recommended_dateFormGroup.value);

      expect(formInputElement.value).toEqual(recommended_dateFormGroup.value);
      expect(recommended_dateFormGroup.errors).toBeNull();

      done();
    }));

  });*/

  it('check max_score value before enter some value', () =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[2];
    const max_scoreFormGroup= component.newLevelForm.get('max_score');

    expect(formInputElement.value).toEqual(max_scoreFormGroup.value.toString());
    expect(max_scoreFormGroup.errors).not.toBeNull();
  });

  it('check max_score value after enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[2];
    const max_scoreFormGroup= component.newLevelForm.get('max_score');

    formInputElement.value='10000';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.value).toEqual(max_scoreFormGroup.value.toString());
      expect(max_scoreFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check count_questions value before enter some value', () =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[3];
    const count_questionsFormGroup= component.newLevelForm.get('count_questions');

    expect(formInputElement.value).toEqual(count_questionsFormGroup.value.toString());
    expect(count_questionsFormGroup.errors).not.toBeNull();
  });

  it('check count_questions value after enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[3];
    const count_questionsFormGroup= component.newLevelForm.get('count_questions');

    formInputElement.value='8';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.value).toEqual(count_questionsFormGroup.value.toString());
      expect(count_questionsFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check allowAttempts value before enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[4];
    const allowAttemptsFormGroup= component.newLevelForm.get('allowAttempts');

    expect(formInputElement.checked).toEqual(allowAttemptsFormGroup.value);

    done();
  });

  it('check allowAttempts value after enter some value', (done) =>
  {
    const allowAttemptsElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check"]`);
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[4];
    const allowAttemptsFormGroup= component.newLevelForm.get('allowAttempts');

    allowAttemptsElement.click();
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.checked).toEqual(allowAttemptsFormGroup.value);

      done();
      flush();
    }));
  });

  it('check penalization value before enter some value', () =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[5];
    const penalizationFormGroup= component.newLevelForm.get('penalization');

    expect(formInputElement.value).toEqual(penalizationFormGroup.value.toString());
    expect(penalizationFormGroup.errors).toBeNull();
  });

  it('check penalization value after enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[5];
    const penalizationFormGroup= component.newLevelForm.get('penalization');

    formInputElement.value='5';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.value).toEqual(penalizationFormGroup.value.toString());
      expect(penalizationFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check checkQuestion_uso value before enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[6];
    const checkQuestion_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkQuestion_uso');

    expect(formInputElement.checked).toEqual(checkQuestion_usoFormGroup.value);

    done();
  });

  it('check checkQuestion_uso value after enter some value', (done) =>
  {
    const checkQuestion_usoElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-question"]`);
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[6];
    const checkQuestion_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkQuestion_uso');

    checkQuestion_usoElement.click();
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.checked).toEqual(checkQuestion_usoFormGroup.value);

      done();
      flush();
    }));
  });

  it('check checkTimer_uso value before enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[7];
    const checkTimer_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkTimer_uso');

    expect(formInputElement.checked).toEqual(checkTimer_usoFormGroup.value);

    done();
  });

  it('check checkTimer_uso value after enter some value', (done) =>
  {
    const checkTimer_usoElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-timer"]`);
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[7];
    const checkTimer_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkTimer_uso');

    checkTimer_usoElement.click();
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.checked).toEqual(checkTimer_usoFormGroup.value);

      done();
      flush();
    }));
  });

  it('check checkDate_uso value before enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[8];
    const checkDate_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkDate_uso');

    expect(formInputElement.checked).toEqual(checkDate_usoFormGroup.value);

    done();
  });

  it('check checkDate_uso value after enter some value', (done) =>
  {
    const checkDate_usoElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-date"]`);
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[8];
    const checkDate_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkDate_uso');

    checkDate_usoElement.click();
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.checked).toEqual(checkDate_usoFormGroup.value);

      done();
      flush();
    }));
  });

  it('check checkAttempt_uso value before enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[9];
    const checkAttempt_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkAttempt_uso');

    expect(formInputElement.checked).toEqual(checkAttempt_usoFormGroup.value);

    done();
  });

  it('check checkAttempt_uso value after enter some value', (done) =>
  {
    const checkAttempt_usoElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-attempt"]`);
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[9];
    const checkAttempt_usoFormGroup= component.newLevelForm.get('badges_checkbox.checkAttempt_uso');

    checkAttempt_usoElement.click();
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.checked).toEqual(checkAttempt_usoFormGroup.value);

      done();
      flush();
    }));
  });

  it('check checkQuestion form values before enter some value', (done) =>
  {
    const checkQuestionElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-question"]`);

    checkQuestionElement.click();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const checkQuestionFormGroup= component.newLevelForm.get('badges.checkQuestion');

      expect(formInputElement1.value).toEqual(checkQuestionFormGroup.value.preguntas_seguidas.toString());
      expect(formInputElement2.value).toEqual(checkQuestionFormGroup.value.valor_bonus.toString());
      expect(checkQuestionFormGroup.valid).not.toBeTruthy();

      done();
    });
  });

  it('check checkQuestion value after enter some value', (done) =>
  {
    const checkQuestionElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-question"]`);

    checkQuestionElement.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const checkQuestionFormGroup= component.newLevelForm.get('badges.checkQuestion');

      formInputElement1.value='6';
      formInputElement2.value='6';
      formInputElement1.dispatchEvent(new Event('input'));
      formInputElement2.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      expect(formInputElement1.value).toEqual(checkQuestionFormGroup.value.preguntas_seguidas.toString());
      expect(formInputElement2.value).toEqual(checkQuestionFormGroup.value.valor_bonus.toString());
      expect(checkQuestionFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check checkTimer form values before enter some value', (done) =>
  {
    const checkTimerElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-timer"]`);

    checkTimerElement.click();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const formInputElement3: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[12];
      const checkTimerFormGroup= component.newLevelForm.get('badges.checkTimer');

      expect(formInputElement1.value).toEqual(checkTimerFormGroup.value.max_time.toString());
      expect(formInputElement2.checked).toEqual(checkTimerFormGroup.value.por_pregunta);
      expect(formInputElement3.value).toEqual(checkTimerFormGroup.value.valor_bonus.toString());
      expect(checkTimerFormGroup.valid).not.toBeTruthy();

      done();
    });
  });

  it('check checkTimer value after enter some value', (done) =>
  {
    const checkTimerElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-timer"]`);

    checkTimerElement.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const formInputElement3: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[12];

      const checkPerQuestionLabel: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check_question"]`);
      const checkTimerFormGroup= component.newLevelForm.get('badges.checkTimer');

      formInputElement1.value='6';
      checkPerQuestionLabel.click();
      formInputElement3.value='6';
      formInputElement1.dispatchEvent(new Event('input'));
      formInputElement2.dispatchEvent(new Event('click'));
      formInputElement3.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      expect(formInputElement1.value).toEqual(checkTimerFormGroup.value.max_time.toString());
      expect(formInputElement2.checked).toEqual(checkTimerFormGroup.value.por_pregunta);
      expect(formInputElement3.value).toEqual(checkTimerFormGroup.value.valor_bonus.toString());
      expect(checkTimerFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check checkDate form values before enter some value', (done) =>
  {
    const checkDateElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-date"]`);

    checkDateElement.click();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const checkDateFormGroup= component.newLevelForm.get('badges.checkDate');

      expect(formInputElement1.value).toEqual(checkDateFormGroup.value.recommended_date == null ? '' : checkDateFormGroup.value.recommended_date);
      expect(formInputElement2.value).toEqual(checkDateFormGroup.value.valor_bonus.toString());
      expect(checkDateFormGroup.valid).not.toBeTruthy();

      done();
    });
  });

  it('check checkDate value after enter some value', (done) =>
  {
    const checkDateElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-date"]`);

    checkDateElement.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const checkDateFormGroup= component.newLevelForm.get('badges.checkDate');

      formInputElement1.value='6';
      formInputElement2.value='6';
      formInputElement1.dispatchEvent(new Event('input'));
      formInputElement2.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      expect(formInputElement1.value).toEqual(checkDateFormGroup.value.recommended_date.toString());
      expect(formInputElement2.value).toEqual(checkDateFormGroup.value.valor_bonus.toString());
      expect(checkDateFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check checkAttempt form values before enter some value', (done) =>
  {
    const checkAttemptElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-attempt"]`);

    checkAttemptElement.click();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const checkAttemptFormGroup= component.newLevelForm.get('badges.checkAttempt');

      expect(formInputElement1.value).toEqual(checkAttemptFormGroup.value.max_attempts.toString());
      expect(formInputElement2.value).toEqual(checkAttemptFormGroup.value.valor_bonus.toString());
      expect(checkAttemptFormGroup.valid).not.toBeTruthy();

      done();
    });
  });

  it('check checkAttempt value after enter some value', (done) =>
  {
    const checkAttemptElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-attempt"]`);

    checkAttemptElement.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const formInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];
      const checkAttemptFormGroup= component.newLevelForm.get('badges.checkAttempt');

      formInputElement1.value='6';
      formInputElement2.value='6';
      formInputElement1.dispatchEvent(new Event('input'));
      formInputElement2.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      expect(formInputElement1.value).toEqual(checkAttemptFormGroup.value.max_attempts.toString());
      expect(formInputElement2.value).toEqual(checkAttemptFormGroup.value.valor_bonus.toString());
      expect(checkAttemptFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check nUnits value before enter some value', () =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
    const nUnitsFormGroup= component.newLevelForm.get('nUnits');

    expect(formInputElement.value).toEqual(nUnitsFormGroup.value == null ? '' : nUnitsFormGroup.value);
    expect(nUnitsFormGroup.errors).not.toBeNull();
    expect(nUnitsFormGroup.errors.required).toBeTruthy();
  });

  it('check nUnits value after enter some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
    const nUnitsFormGroup= component.newLevelForm.get('nUnits');

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      expect(formInputElement.value).toEqual(nUnitsFormGroup.value.toString());
      expect(nUnitsFormGroup.errors).toBeNull();
      expect(component.numberUnits).toEqual(2);

      done();
      flush();
    }));
  });

  //No se puede por el valor del date
  it('check level form is valid with all the entered values', (done) =>
  {
    const descriptionInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[0];
    const recommended_dateInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[1];
    const max_scoreInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[2];
    const count_questionsInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[3];
    const allowAttemptsInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[4];
    const penalizationInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[5];
    const checkQuestionElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-question"]`);
    const checkTimerElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-timer"]`);
    const checkDateElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-date"]`);
    const checkAttemptElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-attempt"]`);

    descriptionInputElement.value= 'Test';
    max_scoreInputElement.value='2000';
    count_questionsInputElement.value='20';
    penalizationInputElement.value='5';
    checkQuestionElement.click();
    checkTimerElement.click();
    checkDateElement.click();
    checkAttemptElement.click();

    descriptionInputElement.dispatchEvent(new Event('input'));
    max_scoreInputElement.dispatchEvent(new Event('input'));
    count_questionsInputElement.dispatchEvent(new Event('input'));
    penalizationInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const preguntasSeguidasInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const valorBonusInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];

      const maxTimeInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[12];
      const porPreguntaInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[13];
      const valorBonusInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[14];

      const recommendedDateInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[15];
      const valorBonusInputElement3: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[16];

      const maxAttemptsInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[17];
      const valorBonusInputElement4: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[18];

      const unitCountInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[19];

      preguntasSeguidasInputElement.value='10';
      valorBonusInputElement1.value='6';

      maxTimeInputElement.value='60';
      valorBonusInputElement2.value='6';

      //recommendedDateInputElement NADA
      valorBonusInputElement3.value='6';

      maxAttemptsInputElement.value='1';
      valorBonusInputElement4.value='6';

      unitCountInputElement.value='1';

      preguntasSeguidasInputElement.dispatchEvent(new Event('input'));
      valorBonusInputElement1.dispatchEvent(new Event('input'));
      maxTimeInputElement.dispatchEvent(new Event('input'));
      valorBonusInputElement2.dispatchEvent(new Event('input'));
      valorBonusInputElement3.dispatchEvent(new Event('input'));
      maxAttemptsInputElement.dispatchEvent(new Event('input'));
      valorBonusInputElement4.dispatchEvent(new Event('input'));
      unitCountInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.newLevelForm.get('description').valid).toBeTruthy();
      //expect(component.newLevelForm.get('recommended_date').valid).toBeTruthy();
      expect(component.newLevelForm.get('max_score').valid).toBeTruthy();
      expect(component.newLevelForm.get('count_questions').valid).toBeTruthy();
      expect(component.newLevelForm.get('allowAttempts').valid).toBeTruthy();
      expect(component.newLevelForm.get('penalization').valid).toBeTruthy();

      expect(component.newLevelForm.get('badges.checkQuestion').valid).toBeTruthy();
      expect(component.newLevelForm.get('badges.checkTimer').valid).toBeTruthy();
      //expect(component.newLevelForm.get('badges.checkDate').valid).toBeTruthy();
      expect(component.newLevelForm.get('badges.checkAttempt').valid).toBeTruthy();

      expect(component.newLevelForm.get('nUnits').valid).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check click button left', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();
      buttonRight.click();

      buttonLeft.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.actualPage).toEqual(1);

      done();
      flush();
    }));
  });

  it('check click button right', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.actualPage).toEqual(1);

      done();
      flush();
    }));
  });

  it('check mostarPrimero value change on click left or right', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.mostrarPrimero).not.toBeTrue();

      buttonLeft.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.mostrarPrimero).toBeTrue();

      done();
      flush();
    }));
  });

  it('check unit form creation', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      const unitFormInputElements= fixture.debugElement.nativeElement.querySelector('#unitname').querySelectorAll('input');

      expect(unitFormInputElements.length).toEqual(1)

      done();
      flush();
    }));
  });

  it('check initial values form', () =>
  {
    const unitFormGroup= component.newUnitForm;
    const unitFormValues=
    {
      unitName: null
    };

    expect(unitFormGroup.value).toEqual(unitFormValues);
  });

  it('check count unit value before inserting some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      const unitFormInputElements: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#unitname').querySelectorAll('input')[0];
      const unitNameFormGroup= component.newUnitForm.get('unitName');

      expect(unitFormInputElements.value).toEqual(unitNameFormGroup.value==null ? '' : unitNameFormGroup.value);
      expect(unitNameFormGroup.errors).not.toBeNull();
      expect(unitNameFormGroup.errors.required).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check count unit value after inserting some value', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      const unitFormInputElements: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#unitname').querySelectorAll('input')[0];
      const unitNameFormGroup= component.newUnitForm.get('unitName');

      unitFormInputElements.value='Unidad 1';
      unitFormInputElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(unitFormInputElements.value).toEqual(unitNameFormGroup.value);
      expect(unitNameFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check validations when all the units are defined ', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='1';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      const unitFormInputElements: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#unitname').querySelectorAll('input')[0];
      const unitNameFormGroup= component.newUnitForm.get('unitName');

      unitFormInputElements.value='Unidad 1';
      unitFormInputElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#submitunit');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();
      tick(1);
      expect(component.units.get(1)).toEqual('Unidad 1');
      expect(component.allUnitsCreated).toBeTrue();

      done();
      flush();
    }));
  });

  it('check validations when NOT all the units are defined ', (done) =>
  {
    const formInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];

    formInputElement.value='2';
    formInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');
      const buttonLeft: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickLeft');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      const unitFormInputElements: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#unitname').querySelectorAll('input')[0];
      const unitNameFormGroup= component.newUnitForm.get('unitName');

      unitFormInputElements.value='Unidad 1';
      unitFormInputElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#submitunit');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();
      tick(1);

      expect(component.units.get(1)).toEqual('Unidad 1');
      expect(component.units.get(2)).toBeUndefined();
      expect(component.allUnitsCreated).not.toBeTrue();

      done();
      flush();
    }));
  });

  it('check new level creation', (done) =>
  {
    levelService=TestBed.inject(LevelService);
    spyOn(levelService, 'createLevel').and.returnValue(new Observable<any>());

    const descriptionInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[0];
    const recommended_dateInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[1];
    const max_scoreInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[2];
    const count_questionsInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[3];
    const allowAttemptsInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[4];
    const penalizationInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[5];
    const checkQuestionElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-question"]`);
    const checkTimerElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-timer"]`);
    const checkDateElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-date"]`);
    const checkAttemptElement: HTMLLabelElement= fixture.debugElement.nativeElement.querySelector(`label[for="check-attempt"]`);

    descriptionInputElement.value= 'Test';
    max_scoreInputElement.value='2000';
    count_questionsInputElement.value='20';
    penalizationInputElement.value='5';
    checkQuestionElement.click();
    checkTimerElement.click();
    checkDateElement.click();
    checkAttemptElement.click();

    descriptionInputElement.dispatchEvent(new Event('input'));
    max_scoreInputElement.dispatchEvent(new Event('input'));
    count_questionsInputElement.dispatchEvent(new Event('input'));
    penalizationInputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const preguntasSeguidasInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[10];
      const valorBonusInputElement1: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[11];

      const maxTimeInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[12];
      const porPreguntaInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[13];
      const valorBonusInputElement2: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[14];

      const recommendedDateInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[15];
      const valorBonusInputElement3: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[16];

      const maxAttemptsInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[17];
      const valorBonusInputElement4: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[18];

      const unitCountInputElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#levelcreateform').querySelectorAll('input')[19];

      preguntasSeguidasInputElement.value='10';
      valorBonusInputElement1.value='6';

      maxTimeInputElement.value='60';
      valorBonusInputElement2.value='6';

      //recommendedDateInputElement NADA
      valorBonusInputElement3.value='6';

      maxAttemptsInputElement.value='1';
      valorBonusInputElement4.value='6';

      unitCountInputElement.value='1';

      preguntasSeguidasInputElement.dispatchEvent(new Event('input'));
      valorBonusInputElement1.dispatchEvent(new Event('input'));
      maxTimeInputElement.dispatchEvent(new Event('input'));
      valorBonusInputElement2.dispatchEvent(new Event('input'));
      valorBonusInputElement3.dispatchEvent(new Event('input'));
      maxAttemptsInputElement.dispatchEvent(new Event('input'));
      valorBonusInputElement4.dispatchEvent(new Event('input'));
      unitCountInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const buttonRight: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clickRight');

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      const unitFormInputElements: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#unitname').querySelectorAll('input')[0];

      unitFormInputElements.value='Unidad 1';
      unitFormInputElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#submitunit');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      component.onSubmitLevel();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.newLevel).not.toBeNull();
      expect(component.newLevel.descripcion).toEqual('Test');
      //expect(component.newLevel.fecha_recomendada_realizacion).toEqual(new Date('17/06/1997'));
      expect(component.newLevel.reintentos).toEqual(false);
      expect(component.newLevel.penalizacion).toEqual(5);
      expect(component.newLevel.puntaje_maximo).toEqual(2000);
      expect(component.newLevel.cantidad_preguntas).toEqual(20);

      expect(component.newLevel.unitList.length).toEqual(1);
      expect(component.newLevel.unitList[0].nombre).toEqual('Unidad 1');

      expect(component.newLevel.badges[0]).toEqual(new BadgeQuestions(null, 6, 10, 0));
      expect(component.newLevel.badges[1]).toEqual(new BadgeTimer(null, 6, 60, false, 1));
      //expect(component.newLevel.badges[2]).toEqual(new BadgeDate(null, 6, new Date('17/06/1997'), 0));
      expect(component.newLevel.badges[3]).toEqual(new BadgeAttempts(null, 6, 1, 3));

      expect(levelService.createLevel).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

});
