import { badgeInfo } from 'src/app/shared/BadgeInformation';
import { BadgeQuestions } from './../shared/BadgeQuestion';
import { BadgeTimer } from './../shared/BadgeTimer';
import { Option } from 'src/app/shared/Option';
import { BadgeDate } from './../shared/BadgeDate';
import { BadgeAttempts } from './../shared/BadgeAttempts';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Level } from './../shared/Level';
import { ConstantService } from './../services/constant.service';
import { UserService } from './../services/user.service';
import { QuestionResultService } from './../services/question-result.service';
import { LevelService } from './../services/level.service';
import { QuestionService } from './../services/question.service';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { LevelQuestionsComponent } from './level-questions.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Question } from '../shared/Question';
import { doesNotReject } from 'assert';
import { CommonModule } from '@angular/common';

describe('LevelQuestionsComponent', () => {
  let component: LevelQuestionsComponent;
  let fixture: ComponentFixture<LevelQuestionsComponent>;
  let questionService;
  let levelService;
  let questionResultService;
  let userService;
  let constantService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelQuestionsComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 1})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelQuestionsComponent);
    component = fixture.componentInstance;

    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'getCountQuestions').and.returnValue(new BehaviorSubject(20));

    questionService= TestBed.inject(QuestionService)
    spyOn(questionService, 'getMaxScore').and.returnValue(new BehaviorSubject(2000));

    userService= TestBed.inject(UserService);
    spyOn(userService, 'getStudentCoins').and.returnValue(of(20));

    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'getSubjectId').and.returnValue(of(5));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.maxScore).toEqual(2000);
    expect(component.actualTime).toEqual(0);
    expect(component.countAnsweredQuestions).toEqual(0);
    expect(component.followedAnsweredQuestions).toEqual(0);
    expect(component.actualQuestion).toEqual(-1);
    expect(component.selection.length).toEqual(2);
    expect(component.optionDisabled.length).toEqual(4);
    expect(component.optionDisableColor.length).toEqual(4);
    expect(component.disableBoosters).not.toBeTrue();
    expect(component.showWonAlert).not.toBeTrue();
    expect(component.winBadges).toEqual(0);
    expect(component.extraBadgesScore).toEqual(0);
    expect(component.countTimer).toEqual(0);
    expect(component.updateCoins).not.toBeTrue();
    expect(component.PENALIZATAION).toEqual(0);
    expect(component.addPenalization).not.toBeTrue();
    expect(component.showCorrect).not.toBeTrue();
    expect(component.showIncorrect).not.toBeTrue();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.availableCoins).toEqual(0);
    });
  });

  it('should get level information', (done) =>
  {
    levelService= TestBed.inject(LevelService);
    userService= TestBed.inject(UserService);
    questionService= TestBed.inject(QuestionService)

    spyOn(levelService, 'getOneLevel').and.returnValue(new Observable<Level>());

    component.getLevelName(2);
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(levelService.getOneLevel).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get number of questions', (done) =>
  {/*
    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'getCountQuestions').and.returnValue(new BehaviorSubject(20));*/

    //component.retrieveCountQuestions();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(levelService.getCountQuestions).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the max score for the level', (done) =>
  {/*
    questionService= TestBed.inject(QuestionService)
    spyOn(questionService, 'getMaxScore').and.returnValue(new BehaviorSubject(2000));*/

    //component.retrieveMaxScore();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(questionService.getMaxScore).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the subject id', (done) =>
  {/*
    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'getSubjectId').and.returnValue(of(5));*/

    //component.retrieveSubjectId();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(levelService.getSubjectId).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the users coins', (done) =>
  {/*
    userService= TestBed.inject(UserService);
    spyOn(userService, 'getStudentCoins').and.returnValue(new BehaviorSubject(20));*/

    //component.getAvailableCoins();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(userService.getStudentCoins).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the questions', (done) =>
  {
    questionService= TestBed.inject(QuestionService);

    spyOn(questionService, 'getQuestions').and.returnValue(new Observable<Array<Question>>());

    component.getQuestions(2);
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(questionService.getQuestions).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the boosters prices', (done) =>
  {
    constantService= TestBed.inject(ConstantService);

    spyOn(constantService, 'getBoosterPrices').and.returnValue(new Observable<Array<any>>());

    component.initializeBoosterPrices();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(constantService.getBoosterPrices).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should calculate the penalization and disabled the boosters', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'getIndividualAttempts').and.
    returnValue(of(
    {
      intentos: 2,
      uso_booster: true,
      uso_insignias: true,
      finalizado: true,
      fecha_ultimo_intento: new Date(),
    }));
    spyOn(questionService, 'addNewAttempt').and.returnValue(new Observable<null>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.PENALIZATAION=0.5;
      component.pendingQuestions(1, 1);
      tick();

      fixture.detectChanges();
      fixture.whenStable();

      expect(questionService.getIndividualAttempts).toHaveBeenCalledTimes(2);
      expect(component.PENALIZATAION).toEqual(1);
      expect(component.disableBoosters).toBeTrue();

      expect(questionService.addNewAttempt).toHaveBeenCalledTimes(2);

      done();
      flush();
    }));
  });

  it('should register the attempt and allow to update the coins', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'getIndividualAttempts').and.returnValue(of(null));
    spyOn(questionService, 'addNewAttempt').and.returnValue(new Observable<null>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.pendingQuestions(1, 1);
      tick();

      fixture.detectChanges();
      fixture.whenStable();

      expect(questionService.getIndividualAttempts).toHaveBeenCalledTimes(2);
      expect(component.updateCoins).toBeTrue();

      expect(questionService.addNewAttempt).toHaveBeenCalledTimes(2);

      done();
      flush();
    }));
  });

  it('should get pending questions', (done) =>
  {
    let today=new Date();
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'getIndividualAttempts').and.
    returnValue(of(
    {
      intentos: 2,
      uso_booster: true,
      uso_insignias: '1000',
      finalizado: false,
      fecha_ultimo_intento: today,
    }));
    spyOn(questionService, 'getQuestionsAfterDate').and.returnValue(new Observable<questionsAnswered>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      //component.PENALIZATAION=0.5;
      component.pendingQuestions(1, 1);
      tick();

      fixture.detectChanges();
      fixture.whenStable();

      expect(questionService.getIndividualAttempts).toHaveBeenCalledTimes(2);
      expect(component.disableBoosters).toBeTrue();
      expect(component.lastDateAttempt).toEqual(today);

      done();
      flush();
    }));
  });

  it('should register the new attempt', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAttempt').and.returnValue(new Observable<null>());
    //spyOn(questionService, 'getIndividualAttempts').and.returnValue(new Observable<individualAnswer>());

    component.registerAttempt(0, 0, 1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(questionService.addNewAttempt).toHaveBeenCalledTimes(2);

      done();
    });
  });

  it('should get the last Date attempt', (done) =>
  {
    const today=new Date();
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'getIndividualAttempts').and.returnValue(
    of(
    {
      intentos: 1,
      uso_booster: true,
      uso_insignias: 1100,
      finalizado: true,
      fecha_ultimo_intento: today,
    }));

    component.getDateAttempt(1, 1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.lastDateAttempt).toEqual(today);

      done();
    });
  });

  it('should check and register the badges of attempts and date when starting a new/old game', (done) =>
  {
    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'updateUsedBadges').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.availableBadges[2]=new BadgeDate(1, 4, new Date('20/21/2023'), 2);
      component.availableBadges[3]=new BadgeAttempts(1, 4, 3, 3);
      /*component.registerBadgeAttempts(1);
      component.registerBadgeDate();*/
      component.badgeRegisterAndGetQuestions(1);

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.wonBadgeIndex).toEqual(2);
      expect(component.extraBadgesScore).toEqual(8);
      expect(component.winBadges).toEqual(3);
      expect(levelService.updateUsedBadges).toHaveBeenCalledTimes(2);
      done();
      flush();
    }));
  });

  it('should select a question to be shown', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewUsedQuestion').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 1, 1,
      30, 200, 1, options1));

      component.getQuestiontoShow();

      fixture.detectChanges();
      fixture.whenStable()

      expect(component.countTimer).toEqual(0);
      expect(component.countAnsweredQuestions).toEqual(1);
      expect(component.anotherAttempt).not.toBeTrue();

      expect(component.selection[0][0]).not.toBeTrue();
      expect(component.selection[0][1]).not.toBeTrue();
      expect(component.selection[0][2]).not.toBeTrue();
      expect(component.selection[0][3]).not.toBeTrue();

      expect(component.selection[1][0]).not.toBeTrue();
      expect(component.selection[1][1]).not.toBeTrue();
      expect(component.selection[1][2]).not.toBeTrue();
      expect(component.selection[1][3]).not.toBeTrue();

      expect(component.optionDisabled[0]).toBeTrue();
      expect(component.optionDisabled[1]).toBeTrue();
      expect(component.optionDisabled[2]).toBeTrue();
      expect(component.optionDisabled[3]).toBeTrue();

      expect(component.optionDisableColor[0]).not.toBeTrue();
      expect(component.optionDisableColor[1]).not.toBeTrue();
      expect(component.optionDisableColor[2]).not.toBeTrue();
      expect(component.optionDisableColor[3]).not.toBeTrue();
      tick();
      expect(component.optionsToSelect).toEqual(1);

      expect(questionService.addNewUsedQuestion).toHaveBeenCalledTimes(1);

      //setQuestionToShow
      expect(component.actualQuestion).toEqual(0);
      expect(component.answeredQuestions[component.actualQuestion]).toBeTrue();

      done();
      flush();
    }));
  });

  it('shold finish the game when there no more questions', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(component, 'calculateFinalResult').and.returnValue(Promise.resolve(209));
    spyOn(questionService, 'setFinishedQuestionnaire').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 1, 1,
      30, 200, 1, options1));

      component.countAnsweredQuestions=2;
      component.countQuestions=1;

      component.getQuestiontoShow();

      fixture.detectChanges();
      fixture.whenStable();
      tick();

      console.log(component.finalScore);
      expect(component.finalScore).toEqual(209);

      done();
      flush();
    }));
  });

  it('should register badge timer', (done) =>
  {
    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'updateUsedBadges').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.availableBadges[1]=new BadgeTimer(1, 4, 120, false, 1);
      //component.availableBadges[3]=new BadgeAttempts(1, 4, 3, 3);
      component.registerBadgeTimer();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.wonBadgeIndex).toEqual(1);
      expect(component.extraBadgesScore).toEqual(4);
      expect(component.winBadges).toEqual(4);
      expect(levelService.updateUsedBadges).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('should register badge question', (done) =>
  {
    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'updateUsedBadges').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.availableBadges[0]=new BadgeQuestions(1, 4, 10, 0);
      component.followedAnsweredQuestions=13;

      fixture.detectChanges();
      fixture.whenStable();

      component.registerBadgeQuestions();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.wonBadgeIndex).toEqual(0);
      expect(component.extraBadgesScore).toEqual(4);
      expect(component.winBadges).toEqual(8);
      expect(levelService.updateUsedBadges).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('should calculate the final result without penalization', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      component.porcentajesPregunta=new Map<number, number>();
      component.maxScore=1000;
      component.countQuestions=10;
      component.addPenalization=false;
      component.extraBadgesScore=100;

      component.porcentajesPregunta.set(1, 100);
      component.porcentajesPregunta.set(2, 100);
      component.porcentajesPregunta.set(3, 100);
      component.porcentajesPregunta.set(4, 100);
      component.porcentajesPregunta.set(5, 100);
      component.porcentajesPregunta.set(6, 100);
      component.porcentajesPregunta.set(7, 100);
      component.porcentajesPregunta.set(8, 100);
      component.porcentajesPregunta.set(9, 100);
      component.porcentajesPregunta.set(10, 100);

      fixture.detectChanges();
      await fixture.whenStable();
      //tick();

      let finalResult=await component.calculateFinalResult()/*.then((res) =>
      {
        finalResult=res;
      });*/

      expect(finalResult).toEqual(2000);
      done();
      //flush();
    });

  });

  it('should calculate the final result with penalization', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      component.porcentajesPregunta=new Map<number, number>();
      component.maxScore=1000;
      component.countQuestions=10;
      component.addPenalization=true;
      component.PENALIZATAION=5;
      component.extraBadgesScore=10;

      component.porcentajesPregunta.set(1, 100);
      component.porcentajesPregunta.set(2, 50);
      component.porcentajesPregunta.set(3, 100);
      component.porcentajesPregunta.set(4, 50);
      component.porcentajesPregunta.set(5, 100);
      component.porcentajesPregunta.set(6, 100);
      component.porcentajesPregunta.set(7, 0);
      component.porcentajesPregunta.set(8, 100);
      component.porcentajesPregunta.set(9, 100);
      component.porcentajesPregunta.set(10, 100);

      fixture.detectChanges();
      await fixture.whenStable();
      //tick();

      let finalResult=await component.calculateFinalResult()/*.then((res) =>
      {
        finalResult=res;
      });*/

      expect(Math.round(finalResult)).toEqual(836);
      done();
      //flush();
    });
  });

  it('should call select answer with single choice question and the right answer', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 1, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=0;

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[0];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 100);

      expect(component.selection[1][0]).toBeTrue();
      expect(component.porcentajesPregunta).toEqual(porcentajePreguntaToCompare);
      expect(component.followedAnsweredQuestions).toEqual(1);
      expect(component.showCorrect).toBeTrue();
      expect(component.availableCoins).toEqual(200);
      expect(questionService.addNewAnswer).toHaveBeenCalledTimes(1);
      expect(userService.setCountCoins).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  it('should call select answer with single choice question and the wrong answer', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 1, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.anotherAttempt=false;

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[1];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 0);

      expect(component.selection[0][1]).toBeTrue();
      expect(component.porcentajesPregunta).toEqual(porcentajePreguntaToCompare);
      expect(component.followedAnsweredQuestions).toEqual(0);
      expect(component.showIncorrect).toBeTrue();
      expect(questionService.addNewAnswer).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  it('should call select answer with single choice question and the wrong answer and with another attempt', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 1, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.anotherAttempt=true;

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[1];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 0);

      expect(component.optionDisableColor[1]).toBeTrue();
      expect(component.anotherAttempt).not.toBeTrue();
      expect(component.optionDisabled[1]).not.toBeTrue();

      done();
      //flush();
    });
  });

  it('should call select answer with multiple choice question and the first right answer', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=0;
      component.optionsToSelect=1;

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[0];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 100);

      expect(component.selection[1][0]).toBeTrue();
      expect(component.optionDisabled[0]).not.toBeTrue();
      expect(component.porcentajesPregunta).toEqual(porcentajePreguntaToCompare);
      expect(component.followedAnsweredQuestions).toEqual(1);
      expect(component.optionsToSelect).toEqual(0);
      expect(component.showCorrect).toBeTrue();
      expect(component.availableCoins).toEqual(200);
      expect(questionService.addNewAnswer).toHaveBeenCalledTimes(1);
      expect(userService.setCountCoins).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  //Aca hay que testear con el hashmap con algo para el else
  it('should call select answer with multiple choice question and the first right answer', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=0;
      component.optionsToSelect=1;

      component.porcentajesPregunta.set(1, 20);

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[0];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(0);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 120);

      expect(component.selection[1][0]).toBeTrue();
      expect(component.optionDisabled[0]).not.toBeTrue();
      expect(component.porcentajesPregunta).toEqual(porcentajePreguntaToCompare);
      expect(component.followedAnsweredQuestions).toEqual(1);
      expect(component.optionsToSelect).toEqual(0);
      expect(component.showCorrect).toBeTrue();
      expect(component.availableCoins).toEqual(200);
      expect(questionService.addNewAnswer).toHaveBeenCalledTimes(1);
      expect(userService.setCountCoins).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  it('should call select answer with multiple choice question and the a wrong answer', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=0;
      component.optionsToSelect=1;
      component.anotherAttempt=false;

      component.porcentajesPregunta.set(1, 20);

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[0];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 0);

      expect(component.selection[0][1]).toBeTrue();
      //expect(component.optionDisabled[0]).not.toBeTrue();
      expect(component.optionDisabled).toEqual([false, false, false, false]);
      expect(component.porcentajesPregunta).toEqual(porcentajePreguntaToCompare);
      expect(component.showIncorrect).toBeTrue();
      expect(component.followedAnsweredQuestions).toEqual(0);
      expect(questionService.addNewAnswer).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  it('should call select answer with multiple choice question and the a wrong answer with another attempt', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'addNewAnswer').and.returnValue(new Observable<any>());

    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=0;
      component.optionsToSelect=1;
      component.anotherAttempt=true;

      component.porcentajesPregunta.set(1, 20);

      await fixture.detectChanges();
      await fixture.whenStable();

      const option= fixture.debugElement.nativeElement.querySelector('#option-questions').querySelectorAll('#option')[0];

      console.log(option);

      option.click();
      option.dispatchEvent(new Event('click'));
      component.onSelectAnswer(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      const porcentajePreguntaToCompare= new Map<number, number>();

      porcentajePreguntaToCompare.set(1, 0);

      expect(component.optionDisabled[1]).not.toBeTrue();
      expect(component.anotherAttempt).not.toBeTrue();
      expect(component.followedAnsweredQuestions).toEqual(0);

      done();
      //flush();
    });
  });

  it('should call use a booster when selecting it type 0, 1, or 2', (done) =>
  {
    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());
    spyOn(userService, 'setUsedBoosterOnLevel').and.returnValue(of(null));
    spyOn(component, 'addMoreTime');

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=50000;
      component.optionsToSelect=1;

      component.porcentajesPregunta.set(1, 20);

      await fixture.detectChanges();
      await fixture.whenStable();

      const booster: HTMLDivElement= fixture.debugElement.nativeElement.querySelector('#booster-time');

      console.log(booster);
      /*
      booster.click();
      booster.dispatchEvent(new Event('click'));*/
      component.useBooster(0, 1, 1, new Date());

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.disableBoosters).toBeTrue();
      expect(component.addMoreTime).toHaveBeenCalledTimes(1);
      expect(component.availableCoins).toEqual(49200);
      expect(userService.setCountCoins).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  it('should call use a booster when selecting it type 3', (done) =>
  {
    userService= TestBed.inject(UserService);
    spyOn(userService, 'setCountCoins').and.returnValue(new Observable<any>());
    spyOn(userService, 'setUsedBoosterOnLevel').and.returnValue(of(null));
    spyOn(component, 'skipQuestion');

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=50000;
      component.optionsToSelect=1;

      component.porcentajesPregunta.set(1, 20);

      await fixture.detectChanges();
      await fixture.whenStable();

      const booster: HTMLDivElement= fixture.debugElement.nativeElement.querySelector('#booster-time');

      /*
      booster.click();
      booster.dispatchEvent(new Event('click'));*/
      component.useBooster(3, 1, 1, new Date());

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.disableBoosters).toBeTrue();
      expect(component.skipQuestion).toHaveBeenCalledTimes(1);
      expect(component.availableCoins).toEqual(45500);
      expect(userService.setCountCoins).toHaveBeenCalledTimes(1);

      done();
      //flush();
    });
  });

  //FUNCIONAMIENTO DE LOS BOOSTERS
  it('should change the answer when skipping the question', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'deleteAnswer').and.returnValue(of(null));
    spyOn(component, 'getQuestiontoShow');

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.skipQuestion(1, 1, new Date());

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(questionService.deleteAnswer).toHaveBeenCalledTimes(1);
      expect(component.getQuestiontoShow).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should add more time when adding more time with the booster', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.addMoreTime();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.actualTime).toEqual(-7);

      done();
    });
  });

  it('should allow another attempt when selecting the another attempt booster', (done) =>
  {
    questionService= TestBed.inject(QuestionService);
    spyOn(questionService, 'deleteAnswer').and.returnValue(of(null));
    spyOn(component, 'getQuestiontoShow');

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.addAnotherAttempt();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.anotherAttempt).toBeTrue();

      done();
    });
  });

  it('should delete two options when deleting options with booster with one right answer', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      const options1=new Array<Option>();

      options1.push(new Option('Test', 100, 1, 1));
      options1.push(new Option('Test', 0, 1, 2));
      options1.push(new Option('Test', 0, 1, 3));
      options1.push(new Option('Test', 0, 1, 4));

      component.questions=null;
      component.questions=new Array<Question>();
      component.questions.push(new Question(1, 'Test', true, 2, 1,
      30, 200, 1, options1));
      component.actualQuestion=0;
      component.lastDateAttempt=new Date();
      component.updateCoins=true;
      component.availableCoins=50000;
      component.optionsToSelect=1;
      component.optionDisabled.fill(true);
      component.optionDisableColor.fill(false);

      await component.deleteTwoOptions();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.optionDisabled.filter(item =>
      {
        return item == false;
      }).length).toEqual(2);

      done();
    });
  });

  it('should update the win badges', (done) =>
  {
    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'updateUsedBadges').and.returnValue(of(null));
    spyOn(component, 'showWonBadgeAlert');

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.updateValueBadgeLevel(1, 1);

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(levelService.updateUsedBadges).toHaveBeenCalledTimes(1);
      expect(component.showWonBadgeAlert).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should show the won badge alert', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.wonBadgeIndex=0;
      component.showWonBadgeAlert();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.showWonAlert).toBeTrue();
      tick(3000);
      expect(component.showWonAlert).not.toBeTrue();

      done();
      flush();
    }));
  });
});

interface questionsAnswered
{
  id_pregunta: number,
  respuesta_correcta: number,
}

interface individualAnswer
{
  intentos: number,
  uso_booster: boolean,
  uso_insignias: string;
  finalizado: boolean,
  fecha_ultimo_intento: Date,
}
