import { SubjectService } from './../services/subject.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { CreateSubjectComponent } from './create-subject.component';
import { Observable } from 'rxjs';

describe('CreateSubjectComponent', () => {
  let component: CreateSubjectComponent;
  let fixture: ComponentFixture<CreateSubjectComponent>;
  let subjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSubjectComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check form element creation', () =>
  {
    const formElementInputs= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input');
    const selectquarter= fixture.debugElement.nativeElement.querySelector('#selectquarter');

    expect(formElementInputs.length).toEqual(4);
    expect(selectquarter).not.toBeNull();
    expect(selectquarter.length).toEqual(2);
  });

  it('check initial values form', () =>
  {
    const subjectFormGroup= component.newSubjectForm;
    const subjectFormValues=
    {
      name: null,
      quarter: null,
      year: null,
      career: null,
      image: null,
    };

    expect(subjectFormGroup.value).toEqual(subjectFormValues);
  });

  it('check name value before inserting values', () =>
  {
    const nameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[0];
    const nameFormGroup= component.newSubjectForm.get('name');

    expect(nameFormElement.value).toEqual(nameFormGroup.value== null ? '' : nameFormGroup.value);
    expect(nameFormGroup.errors).not.toBeNull();
    expect(nameFormGroup.errors.required).toBeTruthy();
  });

  it('check name value after inserting values', (done) =>
  {
    const nameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[0];
    const nameFormGroup= component.newSubjectForm.get('name');

    nameFormElement.value='Test';

    nameFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(nameFormElement.value).toEqual(nameFormGroup.value);
      expect(nameFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check quarter value before inserting values', () =>
  {
    const quarterFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#selectquarter');
    const quarterFormGroup= component.newSubjectForm.get('quarter');

    expect(quarterFormElement.value).toEqual(quarterFormGroup.value== null ? '' : quarterFormGroup.value);
    expect(quarterFormGroup.errors).not.toBeNull();
    expect(quarterFormGroup.errors.required).toBeTruthy();
  });
  /*
  it('check quarter value after inserting values', (done) =>
  {
    const quarterFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#selectquarter');
    const quarterFormGroup= component.newSubjectForm.get('quarter');

    quarterFormElement.click();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const options: HTMLOptionElement=fixture.debugElement.nativeElement.querySelector('option');
      console.log(options);
      options.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(quarterFormElement.value).toEqual(quarterFormGroup.value);
      expect(quarterFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });*/

  it('check year value before inserting values', () =>
  {
    const yearFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[1];
    const yearFormGroup= component.newSubjectForm.get('year');

    expect(yearFormElement.value).toEqual(yearFormGroup.value== null ? '' : yearFormGroup.value);
    expect(yearFormGroup.errors).not.toBeNull();
    expect(yearFormGroup.errors.required).toBeTruthy();
  });

  it('check year value after inserting values', (done) =>
  {
    const yearFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[1];
    const yearFormGroup= component.newSubjectForm.get('year');

    yearFormElement.value='2023';

    yearFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(yearFormElement.value).toEqual(yearFormGroup.value);
      expect(yearFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check career value before inserting values', () =>
  {
    const careerFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[2];
    const careerFormGroup= component.newSubjectForm.get('career');

    expect(careerFormElement.value).toEqual(careerFormGroup.value== null ? '' : careerFormGroup.value);
    expect(careerFormGroup.errors).not.toBeNull();
    expect(careerFormGroup.errors.required).toBeTruthy();
  });

  it('check career value after inserting values', (done) =>
  {
    const careerFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[2];
    const careerFormGroup= component.newSubjectForm.get('career');

    careerFormElement.value='Test en informática';

    careerFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(careerFormElement.value).toEqual(careerFormGroup.value);
      expect(careerFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check image value before inserting values', () =>
  {
    const imageFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[3];
    const imageFormGroup= component.newSubjectForm.get('image');

    expect(imageFormElement.value).toEqual(imageFormGroup.value== null ? '' : imageFormGroup.value);
  });
  /*
  it('check image value after inserting values', (done) =>
  {
    const imageFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[3];
    const imageFormGroup= component.newSubjectForm.get('image');

    imageFormElement.value='Test en informática';

    imageFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(imageFormElement.value).toEqual(imageFormGroup.value);
      expect(imageFormGroup.errors).toBeNull();

      done();
    });
  });*/

  it('check whole form validations', (done) =>
  {
    const nameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[0];
    const quarterFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#selectquarter');
    const yearFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[1];
    const careerFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[2];

    nameFormElement.value='Test',
    yearFormElement.value='2023',
    careerFormElement.value='Test en informática',

    nameFormElement.dispatchEvent(new Event('input'));
    yearFormElement.dispatchEvent(new Event('input'));
    careerFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const newSubjectFormGroup= component.newSubjectForm;

      //expect(newSubjectFormGroup.valid).toBeTruthy();
      expect(newSubjectFormGroup.get('name').valid).toBeTruthy();
      expect(newSubjectFormGroup.get('year').valid).toBeTruthy();
      expect(newSubjectFormGroup.get('career').valid).toBeTruthy();

      done();
    });
  });

  it('check service creation function called', (done) =>
  {
    subjectService= TestBed.inject(SubjectService);

    spyOn(subjectService, 'createSubject').and.returnValue(new Observable<any>());

    const nameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[0];
    const quarterFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#selectquarter');
    const yearFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[1];
    const careerFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#subjectform').querySelectorAll('input')[2];

    nameFormElement.value='Test',
    yearFormElement.value='2023',
    careerFormElement.value='Test en informática',

    nameFormElement.dispatchEvent(new Event('input'));
    yearFormElement.dispatchEvent(new Event('input'));
    careerFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      component.onSubmit();
      const newSubjectFormGroup= component.newSubjectForm;

      expect(subjectService.createSubject).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
