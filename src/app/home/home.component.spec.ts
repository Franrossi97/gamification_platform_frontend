import { SearchBoxComponent } from './../search-box/search-box.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SubjectService } from './../services/subject.service';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Observable } from 'rxjs';
import { SubjectClass } from '../shared/Subject';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let subjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, SearchBoxComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call services to get the subjects', (done) =>
  {
    subjectService=TestBed.inject(SubjectService);

    spyOn(subjectService, 'getSubjectsForTeacher').and.returnValue(new Observable<Array<SubjectClass>>());
    spyOn(subjectService, 'getSubjectsForStudent').and.returnValue(new Observable<Array<SubjectClass>>());

    component.ngOnInit();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(subjectService.getSubjectsForTeacher).toHaveBeenCalledTimes(1);
      expect(subjectService.getSubjectsForStudent).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('check enable subject call service', (done) =>
  {
    subjectService= TestBed.inject(SubjectService);
    spyOn(subjectService, 'hideSubject').and.returnValue(new Observable<any>());
    let subject: SubjectClass=new SubjectClass();
    subject.nombre='Test'; subject.show_menu=true; subject.anio=2021; subject.carrera='Ingeniería en Informática';
    subject.disponible= true; subject.cuatrimestre=2;

    component.subjectsTeacher.push(subject);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#disableSubject');

      button.click();

      expect(subjectService.hideSubject).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('check disable subject call service', (done) =>
  {
    subjectService= TestBed.inject(SubjectService);
    spyOn(subjectService, 'showSubject').and.returnValue(new Observable<any>());
    let subject: SubjectClass=new SubjectClass();
    subject.nombre='Test'; subject.show_menu=false; subject.anio=2021; subject.carrera='Ingeniería en Informática';
    subject.disponible= true; subject.cuatrimestre=2;

    component.subjectsTeacher.push(subject);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#enableSubject');

      button.click();

      expect(subjectService.showSubject).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('check getTeacherSubjectIndexById function', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      let subject1: SubjectClass=new SubjectClass('Test', 2, 2021, 'Ingeniería en Informática', 20, true, true);
      let subject2: SubjectClass=new SubjectClass('Test2', 1, 2021, 'Ingeniería en Informática', 30, true, true);
      subject1.id_materia=20; subject2.id_materia=5;

      component.subjectsTeacher.push(subject1);
      component.subjectsTeacher.push(subject2);

      tick(1000);

      expect(component.getTeacherSubjectIndexById(5)).toEqual(1);
      expect(component.getTeacherSubjectIndexById(2)).toEqual(-1);

      done();
      flush();
    }));
  });
});
