import { QuestionService } from './../../services/question.service';
import { Question } from './../../shared/Question';
import { Option } from './../../shared/Option';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceComponent } from './multiple-choice.component';
import { Observable } from 'rxjs';

describe('MultipleChoiceComponent', () => {
  let component: MultipleChoiceComponent;
  let fixture: ComponentFixture<MultipleChoiceComponent>;
  let questionService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleChoiceComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.selectedOption).not.toBeTrue();
    expect(component.questionType).toEqual(2);
    expect(component.valid).toBeTrue();
  });

  it('should create the question form', () =>
  {
    const questionFormElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input');
    const textAreaFormElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea');

    expect(questionFormElement.length).toEqual(3);
    expect(textAreaFormElement.length).toEqual(1);
  });

  it('check form initial values', () =>
  {
    const questionFormGroup= component.newQuestionForm;
    const questionFormValues={
      question: null,
      difficult: false,
      time: 30,
      coins: 0,
    }

    expect(questionFormGroup.value).toEqual(questionFormValues);
  });

  it('check question value before inserting value', () =>
  {
    const textAreaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea')[0];
    const questionFormGroup= component.newQuestionForm.get('question');

    expect(textAreaFormElement.value).toEqual(questionFormGroup.value == null ? '' : questionFormGroup.value);
    expect(questionFormGroup.errors).not.toBeNull();
    expect(questionFormGroup.errors.required).toBeTruthy();
  });

  it('check question value after inserting value', (done) =>
  {
    const textAreaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea')[0];
    const questionFormGroup= component.newQuestionForm.get('question');

    textAreaFormElement.value='¿Qué es el testing?';
    textAreaFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(textAreaFormElement.value).toEqual(questionFormGroup.value);
      expect(questionFormGroup.errors).toBeNull();

      done();
    });

  });

  it('check difficult value before inserting value', () =>
  {
    const difficultFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[0];
    const difficultFormGroup= component.newQuestionForm.get('difficult');

    expect(difficultFormElement.checked).toEqual(difficultFormGroup.value == null ? '' : difficultFormGroup.value);
  });

  it('check difficult value after inserting value', (done) =>
  {
    const difficultFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[0];
    const difficultFormGroup= component.newQuestionForm.get('difficult');

    difficultFormElement.click();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(difficultFormElement.checked).toEqual(difficultFormGroup.value);

      done();
    });

  });

  it('check time value before inserting value', () =>
  {
    const timeFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[1];
    const timeFormGroup= component.newQuestionForm.get('time');

    expect(timeFormElement.value).toEqual(timeFormGroup.value.toString());
    expect(timeFormGroup.errors).toBeNull();
  });

  it('check time value after inserting value', (done) =>
  {
    const timeFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[1];
    const timeFormGroup= component.newQuestionForm.get('time');

    timeFormElement.value='';
    timeFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(timeFormElement.value).toEqual('');
      expect(timeFormGroup.errors).not.toBeNull();
      expect(timeFormGroup.errors.required).toBeTruthy();

      done();
    });

  });

  it('check coins value before inserting value', () =>
  {
    const coinsFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[2];
    const coinsFormGroup= component.newQuestionForm.get('coins');

    expect(coinsFormElement.value).toEqual(coinsFormGroup.value.toString());
    expect(coinsFormGroup.errors).toBeNull();
  });

  it('check coins value after inserting value', (done) =>
  {
    const coinsFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[2];
    const coinsFormGroup= component.newQuestionForm.get('coins');

    coinsFormElement.value='';
    coinsFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(coinsFormElement.value).toEqual('');
      expect(coinsFormGroup.errors).not.toBeNull();
      expect(coinsFormGroup.errors.required).toBeTruthy();

      done();
    });

  });

  it('check form validations', (done) =>
  {
    const textAreaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea')[0];
    const difficultFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[0];
    const timeFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[1];
    const coinsFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[2];

    textAreaFormElement.value='¿Qué es el testing?';
    difficultFormElement.click();
    timeFormElement.value='50';
    coinsFormElement.value='200';

    textAreaFormElement.dispatchEvent(new Event('input'));
    timeFormElement.dispatchEvent(new Event('input'));
    coinsFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const newQuestionFormGroup=component.newQuestionForm;

      expect(newQuestionFormGroup).toBeTruthy();

      done();
    });
  });

  it('should create the option form', () =>
  {
    const optionTextFormElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea');
    const optionScoreFormElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input');

    expect(optionTextFormElement.length).toEqual(4);
    expect(optionScoreFormElement.length).toEqual(4);
  });

  it('check form initial values of option form', () =>
  {
    const optionFormGroup= component.newOptionsForm;
    const optionFormValues={
      option1:{
        text: null,
        score: 0,
      },
      option2:{
        text: null,
        score: 0,
      },
      option3:{
        text: null,
        score: 0,
      },
      option4:{
        text: null,
        score: 0,
      },
    }

    expect(optionFormGroup.value).toEqual(optionFormValues);
  });

  it('check option1.text value before inserting value', () =>
  {
    const option1textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[0];
    const option1textFormGroup= component.newOptionsForm.get('option1.text');

    expect(option1textFormElement.value).toEqual(option1textFormGroup.value == null ? '' : option1textFormGroup.value);
    expect(option1textFormGroup.errors).not.toBeNull();
    expect(option1textFormGroup.errors.required).toBeTruthy();
  });

  it('check option1.text value after inserting value', (done) =>
  {
    const option1textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[0];
    const option1textFormGroup= component.newOptionsForm.get('option1.text');

    option1textFormElement.value='El testing es testing';
    option1textFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option1textFormElement.value).toEqual(option1textFormGroup.value);
      expect(option1textFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check option1.score value before inserting value', () =>
  {
    const option1scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[0];
    const option1scoreFormGroup= component.newOptionsForm.get('option1.score');

    expect(option1scoreFormElement.value).toEqual(option1scoreFormGroup.value.toString());
  });

  it('check option1.score value after inserting value', (done) =>
  {
    const option1scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[0];
    const option1scoreFormGroup= component.newOptionsForm.get('option1.score');

    option1scoreFormElement.value='-1';

    option1scoreFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option1scoreFormElement.value).toEqual(option1scoreFormGroup.value.toString());
      expect(option1scoreFormGroup.errors).not.toBeNull();

      console.log(option1scoreFormGroup.value);

      done();
    });
  });

  it('check option2.text value before inserting value', () =>
  {
    const option2textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[1];
    const option2textFormGroup= component.newOptionsForm.get('option2.text');

    expect(option2textFormElement.value).toEqual(option2textFormGroup.value == null ? '' : option2textFormGroup.value);
    expect(option2textFormGroup.errors).not.toBeNull();
    expect(option2textFormGroup.errors.required).toBeTruthy();
  });

  it('check option2.text value after inserting value', (done) =>
  {
    const option2textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[1];
    const option2textFormGroup= component.newOptionsForm.get('option2.text');

    option2textFormElement.value='El testing es testing';
    option2textFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option2textFormElement.value).toEqual(option2textFormGroup.value);
      expect(option2textFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check option2.score value before inserting value', () =>
  {
    const option2scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[1];
    const option2scoreFormGroup= component.newOptionsForm.get('option2.score');

    expect(option2scoreFormElement.value).toEqual(option2scoreFormGroup.value.toString());
  });

  it('check option2.score value after inserting value', (done) =>
  {
    const option2scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[1];
    const option2scoreFormGroup= component.newOptionsForm.get('option2.score');

    option2scoreFormElement.value='-1';

    option2scoreFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option2scoreFormElement.value).toEqual(option2scoreFormGroup.value.toString());
      expect(option2scoreFormGroup.errors).not.toBeNull();

      done();
    });
  });

  it('check option3.text value before inserting value', () =>
  {
    const option3textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[2];
    const option3textFormGroup= component.newOptionsForm.get('option3.text');

    expect(option3textFormElement.value).toEqual(option3textFormGroup.value == null ? '' : option3textFormGroup.value);
    expect(option3textFormGroup.errors).not.toBeNull();
    expect(option3textFormGroup.errors.required).toBeTruthy();
  });

  it('check option3.text value after inserting value', (done) =>
  {
    const option3textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[2];
    const option3textFormGroup= component.newOptionsForm.get('option3.text');

    option3textFormElement.value='El testing es testing';
    option3textFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option3textFormElement.value).toEqual(option3textFormGroup.value);
      expect(option3textFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check option3.score value before inserting value', () =>
  {
    const option3scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[2];
    const option3scoreFormGroup= component.newOptionsForm.get('option3.score');

    expect(option3scoreFormElement.value).toEqual(option3scoreFormGroup.value.toString());
  });

  it('check option3.score value after inserting value', (done) =>
  {
    const option3scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[2];
    const option3scoreFormGroup= component.newOptionsForm.get('option3.score');

    option3scoreFormElement.value='-1';

    option3scoreFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option3scoreFormElement.value).toEqual(option3scoreFormGroup.value.toString());
      expect(option3scoreFormGroup.errors).not.toBeNull();

      done();
    });
  });

  it('check option4.text value before inserting value', () =>
  {
    const option4textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[3];
    const option4textFormGroup= component.newOptionsForm.get('option4.text');

    expect(option4textFormElement.value).toEqual(option4textFormGroup.value == null ? '' : option4textFormGroup.value);
    expect(option4textFormGroup.errors).not.toBeNull();
    expect(option4textFormGroup.errors.required).toBeTruthy();
  });

  it('check option4.text value after inserting value', (done) =>
  {
    const option4textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[3];
    const option4textFormGroup= component.newOptionsForm.get('option4.text');

    option4textFormElement.value='El testing es testing';
    option4textFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option4textFormElement.value).toEqual(option4textFormGroup.value);
      expect(option4textFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check option4.score value before inserting value', () =>
  {
    const option4scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[3];
    const option4scoreFormGroup= component.newOptionsForm.get('option4.score');

    expect(option4scoreFormElement.value).toEqual(option4scoreFormGroup.value.toString());
  });

  it('check option4.score value after inserting value', (done) =>
  {
    const option4scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[3];
    const option4scoreFormGroup= component.newOptionsForm.get('option4.score');

    option4scoreFormElement.value='-1';

    option4scoreFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(option4scoreFormElement.value).toEqual(option4scoreFormGroup.value.toString());
      expect(option4scoreFormGroup.errors).not.toBeNull();

      done();
    });
  });

  it('check whole validations options form', (done) =>
  {
    const option1textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[0];
    const option1scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[0];
    const option2textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[1];
    const option2scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[1];
    const option3textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[2];
    const option3scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[2];
    const option4textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[3];
    const option4scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[3];

    option1textFormElement.value='El testing es testing';
    option2textFormElement.value='El testing es testing';
    option3textFormElement.value='El testing es testing';
    option4textFormElement.value='El testing es testing';

    option1textFormElement.dispatchEvent(new Event('input'));
    option2textFormElement.dispatchEvent(new Event('input'));
    option3textFormElement.dispatchEvent(new Event('input'));
    option4textFormElement.dispatchEvent(new Event('input'));

    option1scoreFormElement.value='60';
    option2scoreFormElement.value='40';
    option3scoreFormElement.value='0';
    option4scoreFormElement.value='0';

    option1scoreFormElement.dispatchEvent(new Event('input'));
    option2scoreFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.dispatchEvent(new Event('input'));
    option4scoreFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const optionsFormGroup=component.newOptionsForm;

      expect(optionsFormGroup.valid).toBeTruthy();

      done();
    });
  });

  it('check create options', (done) =>
  {
    const textAreaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea')[0];
    const difficultFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[0];
    const timeFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[1];
    const coinsFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[2];

    const option1textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[0];
    const option1scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[0];
    const option2textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[1];
    const option2scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[1];
    const option3textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[2];
    const option3scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[2];
    const option4textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[3];
    const option4scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[3];

    option1textFormElement.value='El testing es testing';
    option2textFormElement.value='El testing es testing';
    option3textFormElement.value='El testing es testing';
    option4textFormElement.value='El testing es testing';

    option1scoreFormElement.value='50';
    option2scoreFormElement.value='0';
    option3scoreFormElement.value='50';
    option4scoreFormElement.value='0';

    option1scoreFormElement.dispatchEvent(new Event('input'));
    option2scoreFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.dispatchEvent(new Event('input'));
    option4scoreFormElement.dispatchEvent(new Event('input'));

    textAreaFormElement.value='¿Qué es el testing?';
    difficultFormElement.click();
    timeFormElement.value='50';
    coinsFormElement.value='200';

    textAreaFormElement.dispatchEvent(new Event('input'));
    timeFormElement.dispatchEvent(new Event('input'));
    coinsFormElement.dispatchEvent(new Event('input'));

    option1textFormElement.dispatchEvent(new Event('input'));
    option2textFormElement.dispatchEvent(new Event('input'));
    option3textFormElement.dispatchEvent(new Event('input'));
    option4textFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.click();

    const optionsRes=new Array<Option>();

    optionsRes.push(new Option('El testing es testing', 50, 0));
    optionsRes.push(new Option('El testing es testing', 0, 0));
    optionsRes.push(new Option('El testing es testing', 50, 0));
    optionsRes.push(new Option('El testing es testing', 0, 0));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(component.createOptions()).toEqual(optionsRes);

      done();
    });
  });

  it('check create question', (done) =>
  {
    const textAreaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea')[0];
    const difficultFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[0];
    const timeFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[1];
    const coinsFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[2];

    const option1textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[0];
    const option1scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[0];
    const option2textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[1];
    const option2scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[1];
    const option3textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[2];
    const option3scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[2];
    const option4textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[3];
    const option4scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[3];

    option1textFormElement.value='El testing es testing';
    option2textFormElement.value='El testing es testing';
    option3textFormElement.value='El testing es testing';
    option4textFormElement.value='El testing es testing';

    option1scoreFormElement.value='50';
    option2scoreFormElement.value='0';
    option3scoreFormElement.value='50';
    option4scoreFormElement.value='0';

    option1scoreFormElement.dispatchEvent(new Event('input'));
    option2scoreFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.dispatchEvent(new Event('input'));
    option4scoreFormElement.dispatchEvent(new Event('input'));

    textAreaFormElement.value='¿Qué es el testing?';
    difficultFormElement.click();
    timeFormElement.value='50';
    coinsFormElement.value='200';

    textAreaFormElement.dispatchEvent(new Event('input'));
    timeFormElement.dispatchEvent(new Event('input'));
    coinsFormElement.dispatchEvent(new Event('input'));

    option1textFormElement.dispatchEvent(new Event('input'));
    option2textFormElement.dispatchEvent(new Event('input'));
    option3textFormElement.dispatchEvent(new Event('input'));
    option4textFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.click();

    const optionsRes=new Array<Option>();

    optionsRes.push(new Option('El testing es testing', 50, 0));
    optionsRes.push(new Option('El testing es testing', 0, 0));
    optionsRes.push(new Option('El testing es testing', 50, 0));
    optionsRes.push(new Option('El testing es testing', 0, 0));

    const questionRes= new Question(null, '¿Qué es el testing?', true, 2, 1, 50, 200, null, optionsRes);

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const questionActual= component.createQuestion();
      expect(questionActual.texto).toEqual(questionRes.texto);
      expect(questionActual.dificil).toEqual(questionRes.dificil);
      expect(questionActual.tipo_pregunta).toEqual(questionRes.tipo_pregunta);
      expect(questionActual.tiempo).toEqual(questionRes.tiempo);
      expect(questionActual.recompensa).toEqual(questionRes.recompensa);
      expect(questionActual.opciones).toEqual(questionRes.opciones);

      done();
    });
  });

  it('check called creation  of the question to the service', (done) =>
  {
    questionService=TestBed.inject(QuestionService);

    spyOn(questionService, 'createQuestion').and.returnValue(new Observable<any>());

    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#createquestion');

    const textAreaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('textarea')[0];
    const difficultFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[0];
    const timeFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[1];
    const coinsFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#questionForm').querySelectorAll('input')[2];

    const option1textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[0];
    const option1scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[0];
    const option2textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[1];
    const option2scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[1];
    const option3textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[2];
    const option3scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[2];
    const option4textFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('textarea')[3];
    const option4scoreFormElement: HTMLInputElement=fixture.debugElement.nativeElement.querySelector('#optionForm').querySelectorAll('input')[3];

    option1textFormElement.value='El testing es testing';
    option2textFormElement.value='El testing es testing';
    option3textFormElement.value='El testing es testing';
    option4textFormElement.value='El testing es testing';

    option1scoreFormElement.value='50';
    option2scoreFormElement.value='0';
    option3scoreFormElement.value='50';
    option4scoreFormElement.value='0';

    option1scoreFormElement.dispatchEvent(new Event('input'));
    option2scoreFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.dispatchEvent(new Event('input'));
    option4scoreFormElement.dispatchEvent(new Event('input'));

    textAreaFormElement.value='¿Qué es el testing?';
    difficultFormElement.click();
    timeFormElement.value='50';
    coinsFormElement.value='200';

    textAreaFormElement.dispatchEvent(new Event('input'));
    timeFormElement.dispatchEvent(new Event('input'));
    coinsFormElement.dispatchEvent(new Event('input'));

    option1textFormElement.dispatchEvent(new Event('input'));
    option2textFormElement.dispatchEvent(new Event('input'));
    option3textFormElement.dispatchEvent(new Event('input'));
    option4textFormElement.dispatchEvent(new Event('input'));
    option3scoreFormElement.click();

    const optionsRes=new Array<Option>();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      button.click();

      expect(questionService.createQuestion).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
