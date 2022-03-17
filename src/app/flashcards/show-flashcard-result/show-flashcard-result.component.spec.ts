import { FlashcardService } from './../../services/flashcard.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ShowFlashcardResultComponent } from './show-flashcard-result.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';

describe('ShowFlashcardResultComponent', () => {
  let component: ShowFlashcardResultComponent;
  let fixture: ComponentFixture<ShowFlashcardResultComponent>;
  let flashcardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowFlashcardResultComponent ],
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
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFlashcardResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check form creation', () =>
  {
    const filterInputsFormElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select');

    expect(filterInputsFormElement.length).toEqual(2);
  });

  it('check form initial values', () =>
  {
    const filterFormGroup= component.filterForm;
    const filterFormValues=
    {
      quarter: '',
      year: '',
    };

    expect(filterFormGroup.value).toEqual(filterFormValues);
  });

  it('check quarter validations before inserting values', () =>
  {
    const quarterInputsFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[0];
    const quarterFormGroup= component.filterForm.get('quarter');

    expect(quarterInputsFormElement.value).toEqual(quarterFormGroup.value);
    expect(quarterFormGroup.errors).not.toBeNull();
    expect(quarterFormGroup.errors.required).toBeTruthy();
  });

  it('check quarter validations after inserting values', (done) =>
  {
    const quarterInputsFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[0];
    const quarterFormGroup= component.filterForm.get('quarter');

    quarterInputsFormElement.value=quarterInputsFormElement.options[0].value;
    quarterInputsFormElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(quarterInputsFormElement.value).toEqual(quarterFormGroup.value);
      expect(quarterFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check year validations before inserting values', () =>
  {
    const yearInputsFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[1];
    const yearFormGroup= component.filterForm.get('year');

    expect(yearInputsFormElement.value).toEqual(yearFormGroup.value);
    expect(yearFormGroup.errors).not.toBeNull();
    expect(yearFormGroup.errors.required).toBeTruthy();
  });

  it('check year validations after inserting values', (done) =>
  {
    const yearInputsFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[1];
    const yearFormGroup= component.filterForm.get('year');

    yearInputsFormElement.value=yearInputsFormElement.options[0].value;
    yearInputsFormElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(yearInputsFormElement.value).toEqual(yearFormGroup.value);
      expect(yearFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check whole form validations', (done) =>
  {
    const quarterInputsFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[0];
    const yearInputsFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[1];

    yearInputsFormElement.value=yearInputsFormElement.options[0].value;
    quarterInputsFormElement.value=quarterInputsFormElement.options[0].value;

    quarterInputsFormElement.dispatchEvent(new Event('change'));
    yearInputsFormElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.filterForm.valid).toBeTruthy();

      done();
    });
  });

  it('check button calling search service', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);

    spyOn(flashcardService, 'getFlashcardResult').and.returnValue(new Observable<Array<flashcardResult>>());
    const quarterInputsFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[0];
    const yearInputsFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#filterForm').querySelectorAll('select')[1];

    yearInputsFormElement.value=yearInputsFormElement.options[0].value;
    quarterInputsFormElement.value=quarterInputsFormElement.options[0].value;

    quarterInputsFormElement.dispatchEvent(new Event('change'));
    yearInputsFormElement.dispatchEvent(new Event('change'));

    const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#searchButton');

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(flashcardService.getFlashcardResult).toHaveBeenCalledTimes(1);

      done();
    }));
  });
});

interface flashcardResult
{
  id_item: number,
  contenido: string,
  sabe: number,
  sabe_parcial: number,
  no_sabe: number,
}
