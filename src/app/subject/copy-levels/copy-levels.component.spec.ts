import { SubjectClass } from './../../shared/Subject';
import { SubjectService } from './../../services/subject.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';

import { CopyLevelsComponent } from './copy-levels.component';

describe('CopyLevelsComponent', () => {
  let component: CopyLevelsComponent;
  let fixture: ComponentFixture<CopyLevelsComponent>;
  let subjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyLevelsComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id_subject: 1}))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyLevelsComponent);
    component = fixture.componentInstance;

    subjectService= TestBed.inject(SubjectService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.getIdSubject()).toEqual(1);
  });

  it('should get subject information', (done) =>
  {
    let subject: SubjectClass=new SubjectClass('Test', 1, 2022, 'TestInf', 20, true, true, null);
    spyOn(subjectService, 'getOneSubject').and.returnValue(of(subject));

    component.getSubjectInformation();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      //expect(component.getSubject()).toEqual(subject);
      expect(subjectService.getOneSubject).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should get the subject with the same name', (done) =>
  {
    spyOn(subjectService, 'getSubjectBySearchWithOutLimit').and.returnValue(of([new SubjectClass('Test1', 1, 2022, 'TestInf', 20, true, true, null)]));

    component.getRelatedSubjects('Test', -1, -1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(subjectService.getSubjectBySearchWithOutLimit).toHaveBeenCalledTimes(2);
      expect(component.showErrorGetScreen).not.toBeTrue();

      done();
    });
  });

  it('should create the search form', () =>
  {
    const form= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('select');

    expect(form.length).toEqual(2);
  });

  it('check initial values', () =>
  {
    const initialValues={
      quarter: -1,
      year: -1,
    }
    const searchForm=component.subjectFilterForm;

    expect(searchForm.value).toEqual(initialValues);
  });

  it('should search subjects when changing the form values', (done) =>
  {
    component.setSubject(new SubjectClass('Test1', 1, 2022, 'TestInf', 20, true, true, null));
    spyOn(subjectService, 'getSubjectBySearchWithOutLimit').and.returnValue(of([new SubjectClass('Test1', 1, 2022, 'TestInf', 20, true, true, null)]));

    const select: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('select')[0];
    //selectInputsFormElements[0].value=selectInputsFormElements[0].options[11].value;
    select.value= select.options[0].value;

    select.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(subjectService.getSubjectBySearchWithOutLimit).toHaveBeenCalledTimes(2);

      done();
    });
  });

  it('should copy the levels from the selected subject when clicking the button', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async() =>
    {
      component.relatedSubjects=[new SubjectClass('Test1', 1, 2022, 'TestInf', 20, true, true, null)]
      spyOn(subjectService, 'copyLevels').and.returnValue(of(null));

      component.setIdSubject(1);

      await fixture.detectChanges();
      await fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#copyButton');

      button.click();

      await fixture.detectChanges();
      await fixture.whenStable();

      expect(subjectService.copyLevels).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
