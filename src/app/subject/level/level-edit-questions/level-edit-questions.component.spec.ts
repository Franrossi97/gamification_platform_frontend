import { Level } from '../../../shared/Level';
import { Option } from 'src/app/shared/Option';
import { Question } from 'src/app/shared/Question';
import { QuestionService } from 'src/app/services/question.service';
import { LevelService } from '../../../services/level.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LevelEditComponent } from './level-edit.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('LevelEditComponent', () => {
  let component: LevelEditComponent;
  let fixture: ComponentFixture<LevelEditComponent>;
  let levelService;
  let questionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelEditComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id_level: 5}))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelEditComponent);
    component = fixture.componentInstance;

    levelService=TestBed.inject(LevelService);
    questionService=TestBed.inject(QuestionService);

    const questionsToInsert= new Array<Question>();
    const optionsToInsert= new Array<Option>();

    optionsToInsert.push(new Option('Test', 100, 1, 1));
    questionsToInsert.push(new Question(1, 'Test', false, 1, 1, 50, 150, 1, optionsToInsert));

    spyOn(questionService, 'getQuestions').and.returnValue(of(questionsToInsert));

    spyOn(levelService, 'getOneLevel').and.returnValue(of(new Level()));

    fixture.detectChanges();
  });

  it('should create', (done) => {
    spyOn(component, 'getLevelToEdit');
    spyOn(component, 'getQuestions');

    expect(component).toBeTruthy();
    expect(component.editedLevelIndex).toEqual(-1);
    expect(component.editingQuestion).toBeNull();
    expect(component.disableButtonLoadChange).toBeTrue();
    expect(component.showErrorMessage).not.toBeTrue();

    expect(component.disableAddButtons).toEqual([false, false, false, false]);

    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.getLevelToEdit).toHaveBeenCalledTimes(1);
      expect(component.getQuestions).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the level information of the level', (done) =>
  {
    component.getLevelToEdit(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(levelService.getOneLevel).toHaveBeenCalledTimes(2);

      done();
    });
  });

  it('should get the questions of the level', (done) =>
  {
    component.getQuestions(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(questionService.getQuestions).toHaveBeenCalledTimes(2);

      done();
    });
  });

  it('should set parameters when selecting a question to edit', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));
    spyOn(component, 'createEditFeaturesForm');


    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const button= fixture.debugElement.nativeElement.querySelector('#editQuestion');
      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.editingQuestion).toEqual(component.questions[0]);
      expect(component.editingQuestion.opciones).toEqual([new Option('Test', 100, 1, 1)]);
      expect(component.editedAnswer.length).toEqual(0);
      expect(component.editingOption).toBeNull();
      expect(component.editedLevelIndex).toEqual(0);
      expect(component.createEditFeaturesForm).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should create the edit features form when selecting a question', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));


    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const editFeaturesFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input');

      expect(editFeaturesFormElement.length).toEqual(2);

      done();
    }));
  });

  it('check edit features form initial values', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));


    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const featuresFormGroup= component.editFeaturesForm;
      const initialValues= {
        time: 50,
        coins: 150,
      };

      expect(featuresFormGroup.value).toEqual(initialValues);

      done();
    }));
  });

  it('check validations before changing the value of time', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));


    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const timeFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input')[0];
      const timeFormGroup= component.editFeaturesForm.get('time');

      expect(timeFormElement.value).toEqual(timeFormGroup.value.toString());
      expect(timeFormGroup.errors).toBeNull();

      done();
    }));
  });

  it('check validations before changing the value of time', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));


    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const timeFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input')[0];
      const timeFormGroup= component.editFeaturesForm.get('time');

      timeFormElement.value= '';
      timeFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(timeFormElement.value).toEqual(timeFormGroup.value == null ? '' : timeFormGroup.value);
      expect(timeFormGroup.errors).not.toBeNull();
      expect(timeFormGroup.errors.required).toBeTruthy();

      timeFormElement.value= '-20';
      timeFormElement.dispatchEvent(new Event('input'));

      expect(timeFormElement.value).toEqual(timeFormGroup.value.toString());
      expect(timeFormGroup.errors).not.toBeNull();
      expect(timeFormGroup.errors.min).not.toBeNull();

      done();
    }));
  });

  it('check validations before changing the value of coins', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));


    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const coinsFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input')[1];
      const coinsFormGroup= component.editFeaturesForm.get('coins');

      expect(coinsFormElement.value).toEqual(coinsFormGroup.value.toString());
      expect(coinsFormGroup.errors).toBeNull();

      done();
    }));
  });

  it('check validations before changing the value of coins', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const coinsFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input')[1];
      const coinsFormGroup= component.editFeaturesForm.get('coins');

      coinsFormElement.value= '';
      coinsFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(coinsFormElement.value).toEqual(coinsFormGroup.value == null ? '' : coinsFormGroup.value);
      expect(coinsFormGroup.errors).not.toBeNull();
      expect(coinsFormGroup.errors.required).toBeTruthy();

      coinsFormElement.value= '-20';
      coinsFormElement.dispatchEvent(new Event('input'));

      expect(coinsFormElement.value).toEqual(coinsFormGroup.value.toString());
      expect(coinsFormGroup.errors).not.toBeNull();
      expect(coinsFormGroup.errors.min).not.toBeNull();

      done();
    }));
  });

  it('check whole feature form validations after changing the values', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync( () =>
    {
      component.editingQuestion=component.questions[0];
      component.editingQuestion.opciones= [new Option('Test', 100, 1, 1)];
      component.editedAnswer.length=0;
      component.editingOption=null;
      component.editedLevelIndex=0;
      component.createEditFeaturesForm();

      fixture.detectChanges();
      fixture.whenStable();

      const timeFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input')[0];
      const coinsFormElement= fixture.debugElement
        .nativeElement.querySelector('#featuresForm').querySelectorAll('input')[1];
      const coinsFormGroup= component.editFeaturesForm;

      expect(coinsFormGroup.valid).toBeTrue();

      timeFormElement.value= '';
      timeFormElement.dispatchEvent(new Event('input'));

      coinsFormElement.value= '';
      coinsFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(coinsFormGroup.valid).not.toBeTrue();

      coinsFormElement.value= '-20';
      coinsFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(coinsFormGroup.valid).not.toBeTrue();

      done();
    }));
  });

  it('should delete the question pressing the button', (done) =>
  {
    spyOn(questionService, 'deleteQuestion').and.returnValue(of(null));
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const button= fixture.debugElement.nativeElement.querySelector('#deleteQuestion');
      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.questions.length).toEqual(0);

      done();
    });
  });

  it('should set parameters when selecting a question to edit', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const buttonQuestion= fixture.debugElement.nativeElement.querySelector('#editQuestion');
      buttonQuestion.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      const buttonOption= fixture.debugElement.nativeElement.querySelector('#optionEdit');
      buttonOption.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.editQuestionForm).not.toBeNull();
      expect(component.disableButtonLoadChange).not.toBeTrue();
      expect(component.indexEditingOption).toEqual(0);
      expect(component.editingOption).toEqual(component.editingQuestion.opciones[0]);
      expect(component.editQuestionForm.get('answer').value)
      .toEqual('Test');

      expect()

      done();
    });
  });

  it('should create edit answer form', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const editAnswerFormElement= fixture.debugElement.nativeElement
      .querySelector('#editQuestionForm').querySelectorAll('input');

      expect(editAnswerFormElement.length).toEqual(1);

      done();
    });
  });

  it('check initial values edit answer form', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const editAnswerFormGroup= component.editQuestionForm;
      const editAnswerFormValues= {
        answer: 'Test',
      }

      expect(editAnswerFormGroup.value).toEqual(editAnswerFormValues);

      done();
    });
  });

  it('check validations before editing the value of answer', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const answerFormElement= fixture.debugElement.nativeElement
      .querySelector('#editQuestionForm').querySelectorAll('input')[0];
      const answerFormGroup= component.editQuestionForm.get('answer');

      expect(answerFormElement.value).toEqual(answerFormGroup.value);
      expect(answerFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check validations after editing the value of answer', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const answerFormElement= fixture.debugElement.nativeElement
      .querySelector('#editQuestionForm').querySelectorAll('input')[0];
      const answerFormGroup= component.editQuestionForm.get('answer');

      answerFormElement.value='';
      answerFormElement.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(answerFormElement.value).toEqual(answerFormGroup.value);
      expect(answerFormGroup.errors).not.toBeNull();
      expect(answerFormGroup.errors.required).toBeTruthy();;

      done();
    });
  });

  it('should load the new answer to the queue', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const answerFormElement= fixture.debugElement.nativeElement
      .querySelector('#editQuestionForm').querySelectorAll('input')[0];
      const button= fixture.debugElement.nativeElement.querySelector('#loadEditAnswer');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.disableAddButtons[0]).toBeTrue();
      expect(component.editedAnswer).toEqual([new Option('Test', null, null, 1)]);
      expect(component.disableButtonLoadChange).toBeTrue();
      expect(component.editQuestionForm.get('answer').value).toEqual('');

      done();
    });
  });

  it('should load the new answer to the queue', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));
    spyOn(questionService, 'editOptions').and.returnValue(of(null));
    spyOn(component, 'resetAll');

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const answerFormElement= fixture.debugElement.nativeElement
      .querySelector('#editQuestionForm').querySelectorAll('input')[0];
      const button= fixture.debugElement.nativeElement.querySelector('#loadEditAnswer');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      const buttonLoad= fixture.debugElement.nativeElement.querySelector('#loadAll');
      buttonLoad.click();

      expect(questionService.editOptions).toHaveBeenCalledTimes(1);
      expect(component.resetAll);
      expect(component.editingLevel).toBeNull();

      done();
    });
  });

  it('should set some values to default', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      component.resetAll();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.disableAddButtons).toEqual([false, false, false, false]);
      expect(component.editedAnswer.length).toEqual(0);
      expect(component.editingOption).toBeNull();

      done();
    });
  });

  it('should save the new values of the features', (done) =>
  {
    spyOn(questionService, 'getOptionsforQuestion').and.returnValue(of([new Option('Test', 100, 1, 1)]));
    spyOn(questionService, 'editQuestion').and.returnValue(of(null));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.onSelectEditQuestion(1, 0);
      //component.onSelectOption(1, 0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#editFeature');
      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(questionService.editQuestion).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
