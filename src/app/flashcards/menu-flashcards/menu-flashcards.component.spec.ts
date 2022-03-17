import { FlashcardService } from './../../services/flashcard.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { MenuFlashcardsComponent } from './menu-flashcards.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';
import { Flashcard } from 'src/app/shared/Flashcard';

describe('MenuFlashcardsComponent', () => {
  let component: MenuFlashcardsComponent;
  let fixture: ComponentFixture<MenuFlashcardsComponent>;
  let flashcardService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuFlashcardsComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.dontAllowFilters).toEqual([true, true, true]);
  });

  it('should create form', () =>
  {
    const searchFormElement= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input');

    expect(searchFormElement.length).toEqual(1);
  });

  it('check initial values of search form', () =>
  {
    const searchFormGroup= component.searchForm;
    const searchFormValues=
    {
      search: ''
    };

    expect(searchFormGroup.value).toEqual(searchFormValues);
  });

  it('check search value before inserting value', () =>
  {
    const searchInputFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const searchFormGroup= component.searchForm.get('search');

    expect(searchInputFormElement.value).toEqual(searchFormGroup.value);
  });

  it('check search value after inserting value', (done) =>
  {
    const searchInputFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const searchFormGroup= component.searchForm.get('search');

    searchInputFormElement.value='Test';
    searchInputFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(searchInputFormElement.value).toEqual(searchFormGroup.value);

      done();
    });
  });

  it('check whole form validations', (done) =>
  {
    const searchInputFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const searchFormGroup= component.searchForm.get('search');

    searchInputFormElement.value='Test';
    searchInputFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(searchFormGroup.valid).toBeTruthy();

      done();
    });
  });

  it('check search button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'getFlahscardBySearch').and.returnValue(new Observable<Array<Flashcard>>());
    const searchInputFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const searchFormGroup= component.searchForm.get('search');
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#searchButton');

    searchInputFormElement.value='Test';
    searchInputFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(flashcardService.getFlahscardBySearch).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('check cursa filter button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'getFlahscard').and.returnValue(new Observable<Array<Flashcard>>());
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#cursaSubject');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(flashcardService.getFlahscard).toHaveBeenCalledTimes(1);
      expect(component.dontAllowFilters).toEqual([true, false, true]);

      done();
    });
  });

  it('check ensenia filter button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'getFlahscard').and.returnValue(new Observable<Array<Flashcard>>());
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#enseniaSubject');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(flashcardService.getFlahscard).toHaveBeenCalledTimes(1);
      expect(component.dontAllowFilters).toEqual([true, true, false]);

      done();
    });
  });

  it('check clear filter button', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'getFlahscard').and.returnValue(new Observable<Array<Flashcard>>());
    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#clearFilters');

    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(flashcardService.getFlahscard).toHaveBeenCalledTimes(1);
      expect(component.dontAllowFilters).toEqual([false, true, true]);

      done();
    });
  });
});
