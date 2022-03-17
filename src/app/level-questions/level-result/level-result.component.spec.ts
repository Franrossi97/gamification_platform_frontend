import { QuestionResultService } from './../../services/question-result.service';
import { LevelService } from './../../services/level.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { LevelResultComponent } from './level-result.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LevelResultComponent', () => {
  let component: LevelResultComponent;
  let fixture: ComponentFixture<LevelResultComponent>;
  let levelService;
  let questionResultService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelResultComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule/*, badgeInfo*/],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(null)
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelResultComponent);
    component = fixture.componentInstance;

    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'getMaxScore').and.returnValue(of(2900));

    questionResultService= TestBed.inject(QuestionResultService);
    spyOn(questionResultService, 'getFinalScore').and.returnValue(of(2800));

    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'sendLevelId').and.returnValue(of(1));

    fixture.detectChanges();
  });

  it('should create', () => {
    /*levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'sendLevelId').and.returnValue(of(1));*/
    spyOn(component, 'getLevelInformation');
    //spyOn(component, 'initializecartelSpecifications');
    spyOn(component, 'getFinalScore');

    expect(component).toBeTruthy();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(levelService.sendLevelId).toHaveBeenCalledTimes(1);
      expect(component.LEVEL_ID).toEqual(1);
      expect(component.getLevelInformation).toHaveBeenCalledTimes(1);
      //expect(component.initializecartelSpecifications).toHaveBeenCalledTimes(1);
      expect(component.getFinalScore).toHaveBeenCalledTimes(1);
    });
  });

  it('should get the final score of the game', (done) =>
  {
    component.getFinalScore();

    console.log('ESTRELLAS', component.countStars);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      console.log('ESTRELLAS', component.countStars);

      expect(levelService.getMaxScore).toHaveBeenCalledTimes(2);
      expect(questionResultService.getFinalScore).toHaveBeenCalledTimes(2);
      expect(component.finalScore).toEqual(2800);
      expect(component.countStars).toEqual(3);

      done();
    });
  });

  it('should get number of stars depends on the score', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const res1=component.howManyStars(1, 2800);
      expect(res1).toEqual(1);

      const res2=component.howManyStars(1500, 2800);
      expect(res2).toEqual(2);

      const res3=component.howManyStars(2800, 2800);
      expect(res3).toEqual(3);

      done();
    });
  });

  it('shoudl get the subject id and retries', (done) =>
  {
    spyOn(levelService, 'getOneLevel').and.returnValue(of({
      id_materia: 1,
      reintentos: true,
    }));

    component.getLevelInformation(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.SUBJECT_ID).toEqual(1);
      expect(!!component.RETRIES).toEqual(true);

      done();
    });
  });
});
