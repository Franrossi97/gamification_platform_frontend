import { FlashcardService } from './../../services/flashcard.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Level } from './../../shared/Level';
import { of } from 'rxjs';
import { SubjectClass } from './../../shared/Subject';
import { SubjectService } from './../../services/subject.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { CreateFlashcardComponent } from './create-flashcard.component';

describe('CreateFlashcardComponent', () => {
  let component: CreateFlashcardComponent;
  let fixture: ComponentFixture<CreateFlashcardComponent>;
  let subjectService;
  let flashcardService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFlashcardComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFlashcardComponent);
    component = fixture.componentInstance;

    subjectService= TestBed.inject(SubjectService);
    let subject= new SubjectClass('Test', 1, 2022, 'Test', 80, true, true, null);
    subject.id_materia=1;

    spyOn(subjectService, 'getSubjectsForTeacher').and.returnValue(of([subject]));

    let level= new Level();
    level.descripcion='Test'; level.id_nivel=2;
    spyOn(subjectService, 'getLevels').and.returnValue(of([level]));

    localStorage.setItem('userId', '1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showErrorMessage).not.toBeTrue();
  });

  it('check form creation', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      const inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');

      expect(selectInputsFormElements.length).toEqual(2);
      expect(inputsFormElements.length).toEqual(1);

      done();
    });
  });

  it('check form initial values', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const formValues={
        subject: null,
        level: null,
        title: null,
        items: new Array<any>(),
      }
      const formGroup= component.newFlashCardInformationForm;

      expect(formGroup.value).toEqual(formValues);

      done();
    });
  });

  it('check subject validations before inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const subjectFormGroup= component.newFlashCardInformationForm.get('subject');
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');

      expect(selectInputsFormElements[0].value).toEqual('1');
      expect(subjectFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check level validations before inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const subjectFormGroup= component.newFlashCardInformationForm.get('level');
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');

      expect(selectInputsFormElements[1].value).toEqual('');
      expect(subjectFormGroup.errors).not.toBeNull();

      done();
    });
  });

  it('check level validations after inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const subjectFormGroup= component.newFlashCardInformationForm.get('level');
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(selectInputsFormElements[1].value).toEqual('2');
      expect(subjectFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check title validations before inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const subjectFormGroup= component.newFlashCardInformationForm.get('title');
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      const inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(inputsFormElements[0].value).toEqual('Test');
      expect(subjectFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check title validations after inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const subjectFormGroup= component.newFlashCardInformationForm.get('title');
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      const inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      inputsFormElements[0].value='';
      inputsFormElements[0].dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(inputsFormElements[0].value).toEqual('');
      expect(subjectFormGroup.errors).not.toBeNull();
      expect(subjectFormGroup.errors.required).toBeTruthy();

      done();
    });
  });

  it('check items validations before inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const itemsFormGroup= component.getItemsControl();
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      let inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#addFlashcard');
      //spyOn(component, 'onAddNewFlashcardItem');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('textarea')[0];

      expect(inputsFormElements.value).toEqual('');
      expect(itemsFormGroup.controls[0].errors).not.toBeNull();
      expect(itemsFormGroup.controls[0].errors.required).toBeTruthy();

      done();
    });
  });

  it('check items validations after inserting a value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const itemsFormGroup= component.getItemsControl();
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      let inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#addFlashcard');
      //spyOn(component, 'onAddNewFlashcardItem');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('textarea')[0];
      inputsFormElements.value='TestTest10';
      inputsFormElements.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(inputsFormElements.value).toEqual('TestTest10');
      expect(itemsFormGroup.controls[0].errors).toBeNull();

      done();
    });
  });

  it('check if the whole form is valid', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const newFlashcardFormGroup= component.newFlashCardInformationForm;;
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      let inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#addFlashcard');
      //spyOn(component, 'onAddNewFlashcardItem');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('textarea')[0];
      inputsFormElements.value='TestTest10';
      inputsFormElements.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(newFlashcardFormGroup.valid).toBeTruthy();

      done();
    });
  });

  it('should create the flashcard when pressing the button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'postFlashcard').and.returnValue(of(null));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const newFlashcardFormGroup= component.newFlashCardInformationForm;;
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      let inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#addFlashcard');
      //spyOn(component, 'onAddNewFlashcardItem');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('textarea')[0];
      inputsFormElements.value='TestTest10';
      inputsFormElements.dispatchEvent(new Event('input'));

      await fixture.detectChanges();
      await fixture.whenStable();

      const buttonUpdate= fixture.debugElement.nativeElement.querySelector('#createButton');

      buttonUpdate.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(flashcardService.postFlashcard).toHaveBeenCalledTimes(1);
      expect(component.showErrorMessage).toBeFalse();
      done();
    });
  });

  it('should remove the flashcard item when pressing the delete button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'postFlashcard').and.returnValue(of(null));

    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      const itemsFormGroup= component.getItemsControl();
      let selectInputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      let inputsFormElements= fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('input');

      selectInputsFormElements[0].value=selectInputsFormElements[0].options[0].value;

      selectInputsFormElements[0].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements= await fixture.debugElement.nativeElement.querySelector('#newFlashcardForm').querySelectorAll('select');
      selectInputsFormElements[1].value= selectInputsFormElements[1].options[0].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      selectInputsFormElements[1].value= selectInputsFormElements[1].options[1].value;
      selectInputsFormElements[1].dispatchEvent(new Event('change'));

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#addFlashcard');
      //spyOn(component, 'onAddNewFlashcardItem');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      const buttonDelete= fixture.debugElement.nativeElement.querySelector('#removeFlashcardItemButton');
      buttonDelete.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(itemsFormGroup.length).toEqual(0);

      done();
    });
  });

  it('should generate the array of flashcard', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.onAddNewFlashcardItem();
      component.onAddNewFlashcardItem();

      component.getItemsControl().controls[0].setValue('Test1')
      component.getItemsControl().controls[1].setValue('Test2')

      const items=component.generateArrayFlashcardItems();

      fixture.detectChanges();
      fixture.whenStable();

      expect(items[0].toString()).toEqual('Test1');
      expect(items[1].toString()).toEqual('Test2');

      done();
      flush();
    }));
  });
});
