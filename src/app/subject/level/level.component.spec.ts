import { BadgeAttempts } from './../../shared/BadgeAttempts';
import { Badge } from 'src/app/shared/Badge';
import { Unit } from './../../shared/Unit';
import { Level } from './../../shared/Level';
import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { LevelService } from './../../services/level.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelComponent } from './level.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('LevelComponent', () => {
  let component: LevelComponent;
  let fixture: ComponentFixture<LevelComponent>;
  let levelService;
  let userService;
  let permissionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id: 1}))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelComponent);
    component = fixture.componentInstance;

    levelService= TestBed.inject(LevelService);
    userService= TestBed.inject(UserService);
    permissionService= TestBed.inject(PermissionService);
    localStorage.setItem('userId', '1');

    fixture.detectChanges();
  });

  it('should create', (done) => {
    spyOn(component, 'getLevels');
    spyOn(permissionService, 'canEdit').and.resolveTo(true);

    expect(component).toBeTruthy();
    expect(component.editOpened).not.toBeTrue();
    expect(component.editingLevelId).toEqual(0);
    expect(component.canEdit).not.toBeTrue();
    expect(component.showEditName).toEqual(0);
    expect(component.showEditUnit).toEqual(0);
    expect(component.showNewUnit).toEqual(0);
    expect(component.showNewScore).toEqual(0);
    expect(component.showNewCountQuestions).toEqual(0);
    expect(component.showAttemptError).toEqual(0);
    expect(component.showDeletePopUpId).toEqual(-1);

    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.getLevels).toHaveBeenCalledTimes(1);
      expect(permissionService.canEdit).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should change the level availability', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      /*
      component.levels=new Array<Level>();
      let levelToInsert= new Level();
      levelToInsert.id_nivel=1; levelToInsert.descripcion='Test';
      levelToInsert.fecha_recomendada_realizacion= new Date();
      levelToInsert.cantidad_preguntas=20; levelToInsert.puntaje_maximo=5000;
      levelToInsert.reintentos=true; levelToInsert.penalizacion=5;
      levelToInsert.cuestionario_disponible=true; levelToInsert.creado_por=1;
      levelToInsert.cantidad_estudiantes_intentos=1; levelToInsert.fecha_creacion=new Date();
      levelToInsert.id_materia=1; levelToInsert.unitList=new Array<Unit>();
      levelToInsert.badges= new Array<Badge>();
      const unit1= new Unit(); unit1.id_unidad=1; unit1.nombre='Test';
      levelToInsert.unitList.push(unit1);
      levelToInsert.badges.push(new BadgeAttempts(1, 5, 2, 1));
      component.levels.push(levelToInsert);*/
      component.canEdit=true;

      await fixture.detectChanges();
      await fixture.whenStable();





      //done();
    });
  });
});
