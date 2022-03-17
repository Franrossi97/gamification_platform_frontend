import { UserService } from './../services/user.service';
import { SubjectService } from './../services/subject.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { SubjectClass } from '../shared/Subject';

import { SearchBoxComponent } from './search-box.component';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let subjectTest;
  let subjectService;
  let userService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBoxComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    subjectTest=new SubjectClass();
    subjectTest.nombre='Introducción a la Informática';
    subjectTest.studentsCount=2;
    subjectTest.anio=2021;
    subjectTest.cuatrimestre=1;

    component.searchResultSubject=new Array<SubjectClass>();
    component.searchResultSubject.push(subjectTest);
    component.searchResultSubject.push(new SubjectClass());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    const formSearchElement=fixture.debugElement.nativeElement.querySelector('#search-box');
    const inputSearchElements=formSearchElement.querySelectorAll('input');

    expect(inputSearchElements.length).toEqual(1);
  });

  it('initial value check', () => {
    const searchFormGroup=component.searchForm;
    const searchFormValues={
      search: '',
    };

    expect(searchFormGroup.value).toEqual(searchFormValues);
  });

  it('validation form check', () => {
    const formSearchElement=fixture.debugElement.nativeElement.querySelector('#search-box');
    const inputSearchElement=formSearchElement.querySelectorAll('input')[0];
    const searchValueFormGroup=component.searchForm.get('search');

    expect(inputSearchElement.value).toEqual(searchValueFormGroup.value);
    expect(searchValueFormGroup.errors).not.toBeNull();
    expect(searchValueFormGroup.errors.required).toBeTruthy();
  });

  it('validation after form check', async () => {
    const formSearchElement=fixture.debugElement.nativeElement.querySelector('#search-box');
    const inputSearchElement=formSearchElement.querySelectorAll('input')[0];

    inputSearchElement.value='Introducción';
    inputSearchElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const searchValueFormGroup=component.searchForm.get('search');

      expect(inputSearchElement.value).toEqual(searchValueFormGroup.value);
      expect(searchValueFormGroup.errors).toBeNull();
    });
  });

  it('should select correctly the subject', () =>
  {
    component.onSelectSubject(0);
    expect(component.selectedSubject).toEqual(subjectTest);
  });

  it('should not select correctly the subject', () =>
  {
    component.onSelectSubject(1);
    expect(component.selectedSubject).not.toEqual(subjectTest);
  });

  it('search the subject', fakeAsync(() =>
  {
    subjectService=TestBed.inject(SubjectService);

    spyOn(subjectService, 'getSubjectBySearch').and.returnValue(new Observable<SubjectClass>());

    fixture.detectChanges();

    const formElement=fixture.debugElement.nativeElement.querySelector('#search-box');
    const inputSearchElement=formElement.querySelectorAll('input')[0];

    inputSearchElement.value='Introducción';

    component.onSearchSubject();

    expect(subjectService.getSubjectBySearch).toHaveBeenCalledTimes(1);

  }));

  it('singup to subject', fakeAsync(() =>
  {
    userService=TestBed.inject(UserService);

    spyOn(userService, 'linkUsertoSubject').and.returnValue(new Observable<any>());

    fixture.detectChanges();

    component.onSingUpSubject(0);

    expect(userService.linkUsertoSubject).toHaveBeenCalledTimes(1);

  }));

});
