import { Unit } from './../shared/Unit';
import { LevelService } from './../services/level.service';
import { LevelComponent } from './level/level.component';
import { OptionsComponent } from './options/options.component';
import { Level } from 'src/app/shared/Level';
import { SubjectService } from './../services/subject.service';
import { PermissionService } from './../services/permission.service';
import { UserService } from './../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SubjectComponent } from './subject.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SubjectClass } from '../shared/Subject';
import { NavegationComponent } from './navegation/navegation.component';

describe('SubjectComponent', () => {
  let component: SubjectComponent;
  let fixture: ComponentFixture<SubjectComponent>;
  let userService;
  let permissionService;
  let subjectService;
  let levelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectComponent, NavegationComponent, OptionsComponent, LevelComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 1})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectComponent);
    component = fixture.componentInstance;

    userService= TestBed.inject(UserService);
    spyOn(userService, 'numberUserType').and.resolveTo(1);

    permissionService= TestBed.inject(PermissionService);
    spyOn(permissionService, 'canEdit').and.resolveTo(true);

    subjectService= TestBed.inject(SubjectService);

    let level: Level=new Level();
    level.id_materia=1;
    spyOn(subjectService, 'getLevels').and.returnValue(of([new Level()]));
    spyOn(subjectService, 'getOneSubject').and.returnValue(of(new SubjectClass('Test', 1, 2022, 'TestIng', 28, true, true, null)));

    levelService= TestBed.inject(LevelService);
    spyOn(levelService, 'getUnits').and.returnValue(of([new Unit()]));

    fixture.detectChanges();
  });

  it('should create', (done) =>
  {
    spyOn(component, 'getUserType');
    //spyOn(component, 'getWholeSubjectData');

    expect(component).toBeTruthy();

    //component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.getUserType).toHaveBeenCalledTimes(1);
      //expect(component.getWholeSubjectData).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
