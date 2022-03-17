import { Achievement } from './../../shared/Achievement';
import { ParticipantsListService } from './../../services/participants-list.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AchievementMenuComponent } from './achievement-menu.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AchievementMenuComponent', () => {
  let component: AchievementMenuComponent;
  let fixture: ComponentFixture<AchievementMenuComponent>;
  let participantsListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchievementMenuComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id_subject: 1})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementMenuComponent);
    component = fixture.componentInstance;

    component.idStudent=1;
    component.studentName='Franco Rossi'

    participantsListService= TestBed.inject(ParticipantsListService);
    spyOn(participantsListService, 'getAchievementsForUser').and.returnValue(of([new Achievement(1, 'Test', 'Test', 5, 1)]));
    spyOn(participantsListService, 'getAchievementsForSubject').and.returnValue(of([new Achievement(1, 'Test', 'Test', 5, 1)]));

    fixture.detectChanges();
  });

  it('should create', (done) => {


    spyOn(component, 'getAchievementDataUser');
    spyOn(component, 'getAchievementDataSubject');
    spyOn(component, 'createAchievementForm');

    expect(component).toBeTruthy();
    expect(component.showNewAchievementForm).not.toBeTrue();
    expect(component.errorMessageOnCreate).not.toBeTrue();
    expect(component.errorMessageOnAssignation).not.toBeTrue();

    component.ngOnInit();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.getAchievementDataUser).toHaveBeenCalledTimes(1);
      expect(component.getAchievementDataSubject).toHaveBeenCalledTimes(1);
      expect(component.createAchievementForm).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the achievements of the user', (done) =>
  {
    component.getAchievementDataUser(1, 1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(participantsListService.getAchievementsForUser).toHaveBeenCalledTimes(2);

      done();
    });
  });

  it('should get the available achievements of the subject', (done) =>
  {
    component.getAchievementDataSubject(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(participantsListService.getAchievementsForSubject).toHaveBeenCalledTimes(2);

      done();
    });
  });

  it('should create the form when pressing the button', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#createAchievement');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.showNewAchievementForm).toBeTrue();
      expect(component.newAchievementForm).not.toBeNull();

      done();
    });
  });

  it('should create the achivement form', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const achievementInputForm: HTMLInputElement[]= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input');
      const achievementTextAreaForm: HTMLInputElement[]= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('textarea');

      expect(achievementInputForm.length).toEqual(2);
      expect(achievementTextAreaForm.length).toEqual(1);

      done();
    });
  });

  it('check form initial values', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const newAchievementForm=component.newAchievementForm;
      const initialValues=
      {
        title:'',
        description:'',
        increment: 0,
      }

      expect(newAchievementForm.value).toEqual(initialValues);
      done();
    });
  });

  it('check title validation before inserting a value', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const titleFormComponent= component.newAchievementForm.get('title');
      const titleInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[0];

      expect(titleInputForm.value).toEqual(titleFormComponent.value);
      expect(titleFormComponent.errors).not.toBeNull();
      expect(titleFormComponent.errors.required).toBeTruthy();

      done();
    });
  });

  it('check title validation after inserting a value', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      const titleFormComponent= component.newAchievementForm.get('title');
      const titleInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[0];

      titleInputForm.value='Test28';
      titleInputForm.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(titleInputForm.value).toEqual(titleFormComponent.value);
      expect(titleFormComponent.errors).toBeNull();

      done();
    });
  });

  it('check description validation before inserting a value', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const descriptionFormComponent= component.newAchievementForm.get('description');
      const descriptionInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('textarea')[0];

      expect(descriptionInputForm.value).toEqual(descriptionFormComponent.value);
      expect(descriptionFormComponent.errors).not.toBeNull();
      expect(descriptionFormComponent.errors.required).toBeTruthy();

      done();
    });
  });

  it('check description validation after inserting a value', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      const descriptionFormComponent= component.newAchievementForm.get('description');
      const descriptionInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('textarea')[0];

      descriptionInputForm.value='Test28';
      descriptionInputForm.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(descriptionInputForm.value).toEqual(descriptionFormComponent.value);
      expect(descriptionFormComponent.errors).toBeNull();

      done();
    });
  });

  it('check increment validation before inserting a value', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const incrementFormComponent= component.newAchievementForm.get('increment');
      const incrementInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[1];

      expect(incrementInputForm.value).toEqual(String(incrementFormComponent.value));
      expect(incrementFormComponent.errors).toBeNull();

      done();
    });
  });

  it('check increment validation after inserting a value', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      const incrementFormComponent= component.newAchievementForm.get('increment');
      const incrementInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[1];

      incrementInputForm.value='5';
      incrementInputForm.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(incrementInputForm.value).toEqual(String(incrementFormComponent.value));
      expect(incrementFormComponent.errors).toBeNull();

      done();
    });
  });

  it('check whole validations of the form', (done) =>
  {
    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      const titleFormComponent= component.newAchievementForm.get('title');
      const titleInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[0];

      const descriptionFormComponent= component.newAchievementForm.get('description');
      const descriptionInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('textarea')[0];

      const incrementFormComponent= component.newAchievementForm.get('increment');
      const incrementInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[1];

      titleInputForm.value= 'Test28'
      titleInputForm.dispatchEvent(new Event('input'));

      descriptionInputForm.value= 'Test';
      descriptionInputForm.dispatchEvent(new Event('input'));

      incrementInputForm.value='5';
      incrementInputForm.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(titleInputForm.value).toEqual(titleFormComponent.value);
      expect(descriptionInputForm.value).toEqual(descriptionFormComponent.value);
      expect(incrementInputForm.value).toEqual(String(incrementFormComponent.value));

      expect(component.newAchievementForm.valid).toBeTruthy();

      done();
    });
  });

  it('should create a new achievement after inserting all the values', (done) =>
  {
    spyOn(participantsListService, 'createAchievement').and.returnValue(of(null));

    component.onCreateAchievementForm();

    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      const titleInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[0];
      const descriptionInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('textarea')[0];
      const incrementInputForm: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#newAchievementForm').querySelectorAll('input')[1];

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#createAchievementButton');

      titleInputForm.value= 'Test28'
      titleInputForm.dispatchEvent(new Event('input'));

      descriptionInputForm.value= 'Test';
      descriptionInputForm.dispatchEvent(new Event('input'));

      incrementInputForm.value='5';
      incrementInputForm.dispatchEvent(new Event('input'));

      button.click();
      button.dispatchEvent(new Event('click'));
      component.onCreateAchievement();
      await fixture.detectChanges();
      await fixture.whenStable();

      expect(participantsListService.createAchievement).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should select an existing achievements when clicking it', (done) =>
  {
    const achieveToSelect: HTMLDivElement= fixture.debugElement.nativeElement.querySelector('#selectAchievement');

    achieveToSelect.click();
    achieveToSelect.dispatchEvent(new Event('click'));
    component.onSelectAchievement(1);

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      expect(component.selectedAchievements).toEqual([1]);

      component.onSelectAchievement(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedAchievements).toEqual([]);
      done();
    });
  });

  it('should assign the selected achievements when clicking the button', (done) =>
  {
    spyOn(participantsListService, 'assignAchievements').and.returnValue(of(null));

    component.userAchievements.length=0;
    component.subjectAchievements=[new Achievement(1, 'Test1', 'Test1', 5, 1), new Achievement(2, 'Test2', 'Test2', 5, 1)];
    component.selectedAchievements=[1, 2];
    const button= fixture.debugElement.nativeElement.querySelector('#assignAchievents');

    button.click();
    button.dispatchEvent(new Event('click'));
    //component.onAssignAchievement();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(participantsListService.assignAchievements).toHaveBeenCalledTimes(1);
      expect(component.userAchievements).toEqual([new Achievement(1, 'Test1', 'Test1', 5, 1), new Achievement(2, 'Test2', 'Test2', 5, 1)]);
      expect(component.errorMessageOnAssignation).not.toBeTrue();
      expect(component.selectedAchievements.length).toEqual(0);

      done();
    });
  });

  it('should unassign an achievement when clicking the button', (done) =>
  {
    component.userAchievements=[new Achievement(1, 'Test1', 'Test1', 5, 1), new Achievement(2, 'Test2', 'Test2', 5, 1)];

    spyOn(participantsListService, 'unAssignAchievements').and.returnValue(of(null));

    const button= fixture.debugElement.nativeElement.querySelector('#deleteAchievement');

    button.click();
    //button.dispatchEvent(new Event('click'));
    //component.onUnassignAchievement(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.userAchievements).toEqual([new Achievement(2, 'Test2', 'Test2', 5, 1)]);

      done();
    });
  });

  it('should delete a subject achievement when clicking the button', (done) =>
  {
    spyOn(participantsListService, 'deleteAchievement').and.returnValue(of(null));

    const button= fixture.debugElement.nativeElement.querySelector('#deleteSystemAchievement');

    button.click();
    //button.dispatchEvent(new Event('click'));
    //component.onDeleteAchievement(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.subjectAchievements).toEqual([]);

      done();
    });
  });
});
