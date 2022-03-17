import { FlashcardItem } from './../../shared/FlashcardItem';
import { FlashcardService } from './../../services/flashcard.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { EditFlashcardComponent } from './edit-flashcard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { doesNotReject } from 'assert';

describe('EditFlashcardComponent', () => {
  let component: EditFlashcardComponent;
  let fixture: ComponentFixture<EditFlashcardComponent>;
  let flashcardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFlashcardComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id_flashcard: 2}))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showFlashcardForm).not.toBeTrue();
    expect(component.updateTitleError).not.toBeTrue();
    expect(component.updateItemError).not.toBeTrue();
    expect(component.showFlashcardItemForm).toEqual(-1);
  });

  it('should call the service to get the information of the flashcard', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'getFlashcardItems').and.returnValue(new Observable<Array<FlashcardItem>>());
    component.ngOnInit();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      expect(flashcardService.getFlashcardItems).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('should create title flashcard edit', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const titleFlashcardFormElement= fixture.debugElement.nativeElement.querySelector('#editTitleForm').querySelectorAll('textarea');

      expect(component.showFlashcardForm).toBeTrue();
      expect(titleFlashcardFormElement.length).toEqual(1);

      done();
    });
  });

  it('check title flashcard edit value', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const editTitleFormGroup= component.editFlashcardForm;
      const editTitleValue=
      {
        title: 'Título no encontrado'
      };

      expect(editTitleFormGroup.value).toEqual(editTitleValue);

      done();
    });
  });

  it('check title validations before editing value', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const titleFlashcardFormElement= fixture.debugElement.nativeElement.querySelector('#editTitleForm').querySelectorAll('textarea')[0];
      const editTitleFormGroup= component.editFlashcardForm.get('title');

      expect(titleFlashcardFormElement.value).toEqual(editTitleFormGroup.value);
      expect(editTitleFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check title validations after editing value', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const titleFlashcardFormElement= fixture.debugElement.nativeElement.querySelector('#editTitleForm').querySelectorAll('textarea')[0];
      const editTitleFormGroup= component.editFlashcardForm.get('title');

      titleFlashcardFormElement.value='';
      titleFlashcardFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(titleFlashcardFormElement.value).toEqual(editTitleFormGroup.value);
      expect(editTitleFormGroup.errors).not.toBeNull();
      expect(editTitleFormGroup.errors.required).toBeTruthy();

      done();
    }));
  });

  it('check whole values and validations of the form', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const titleFlashcardFormElement= fixture.debugElement.nativeElement.querySelector('#editTitleForm').querySelectorAll('textarea')[0];

      titleFlashcardFormElement.value='Test';
      titleFlashcardFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.editFlashcardForm.valid).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check cancel editing title', (done) =>
  {
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonCancel: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#cancelEditTitle');

      buttonCancel.click();

      expect(component.showFlashcardForm).not.toBeTrue();

      done();
      flush();
    }));
  });

  it('check edit button title', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'editFlashcard').and.returnValue(new Observable<any>());

    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#titleFormButton');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonCancel: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editTitle');

      buttonCancel.click();

      expect(flashcardService.editFlashcard).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('check delete flashcard button', () =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'deleteFlashcard').and.returnValue(new Observable<any>());

    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#deleteFlashcard');

    button.click();

    expect(flashcardService.deleteFlashcard).toHaveBeenCalledTimes(1);
  });

  it('check form creation on click edit button', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const textareaFormElement=fixture.debugElement.nativeElement.querySelector('#editItemFlashcardForm').querySelectorAll('textarea');

      expect(textareaFormElement.length).toEqual(1);

      done();
      flush();
    }));
  });

  it('check edit flashcard form initial value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const textareaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#editItemFlashcardForm').querySelectorAll('textarea')[0];
      const textareaFormGroup= component.editFlashcardItemForm;
      const textareaFormGroupValue=
      {
        content: textareaFormElement.value
      };

      expect(textareaFormGroup.value).toEqual(textareaFormGroupValue);

      done();
      flush();
    }));
  });

  it('check edit flashcard before inserting value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const textareaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#editItemFlashcardForm').querySelectorAll('textarea')[0];
      const textareaFormGroup= component.editFlashcardItemForm.get('content');

      expect(textareaFormElement.value).toEqual(textareaFormGroup.value);
      expect(textareaFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check edit flashcard after inserting value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const textareaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#editItemFlashcardForm').querySelectorAll('textarea')[0];
      const textareaFormGroup= component.editFlashcardItemForm.get('content');

      textareaFormElement.value='';
      textareaFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(textareaFormElement.value).toEqual(textareaFormGroup.value);
      expect(textareaFormGroup.errors).not.toBeNull();
      expect(textareaFormGroup.errors.required).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check whole form validations', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const textareaFormElement: HTMLTextAreaElement=fixture.debugElement.nativeElement.querySelector('#editItemFlashcardForm').querySelectorAll('textarea')[0];

      textareaFormElement.value='Test';
      textareaFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.editFlashcardItemForm.valid).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check cancel edit item form button', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const cancelButton: HTMLButtonElement=fixture.debugElement.nativeElement.querySelector('#cancelEdit');

      cancelButton.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.showFlashcardItemForm).toEqual(-1);

      done();
      flush();
    }));
  });

  it('check edit item form button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'editFlashcardItem').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const editButton: HTMLButtonElement=fixture.debugElement.nativeElement.querySelector('#editItem');

      editButton.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(flashcardService.editFlashcardItem).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('check delete item button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'deleteFlashcardItem').and.returnValue(new Observable<any>());

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      fixture.detectChanges();
      fixture.whenStable();

      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#editItemFlashcard');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      const deleteButton: HTMLButtonElement=fixture.debugElement.nativeElement.querySelector('#deleteItem');

      deleteButton.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(flashcardService.deleteFlashcardItem).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });
});
