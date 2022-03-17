import { PermissionService } from './../services/permission.service';
import { SubjectClass } from 'src/app/shared/Subject';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SubjectService } from './../services/subject.service';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Observable } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let subjectService;
  let permissionService;
  localStorage.setItem('userId', '0');
  localStorage.setItem('currentUser', 'test@test.com');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent, FaIconComponent ],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the user subjects', () =>
  {
    subjectService=TestBed.inject(SubjectService);

    spyOn(subjectService, 'getSubjectsForStudent').and.returnValue(new Observable<SubjectClass[]>());

    fixture.detectChanges();

    component.getSubjects();

    expect(subjectService.getSubjectsForStudent).toHaveBeenCalledTimes(1);
  });

  it('check authentication', () =>
  {
    localStorage.setItem('currentUser', 'test@gmail.com');

    expect(component.isAuthenticated()).toBeTrue();
  });

  it('check authentication', () =>
  {
    localStorage.removeItem('currentUser');

    expect(component.isAuthenticated()).not.toBeTrue();
  });
  /*
  it('check logout list', () =>
  {
    component.showRight=true;
    localStorage.setItem('currentUser', 'test@test.com')

    const button=fixture.debugElement.nativeElement.querySelector('#logOutList');

    button.click();

    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(component.canView).not.toBeTrue();
  });*/

  it('check logout button', () =>
  {
    const button=fixture.debugElement.nativeElement.querySelector('#logOut');

    button.click();

    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(component.canView).not.toBeTrue();
  });

  it('check onShow', () =>
  {
    component.show=true;

    const button=fixture.debugElement.nativeElement.querySelector('#onShow');

    button.click();

    expect(component.show).not.toBeTrue();

    button.click();

    expect(component.show).toBeTrue();
  });

  it('check onShowRight', () =>
  {
    component.showRight=true;

    const button=fixture.debugElement.nativeElement.querySelector('#onShowRight');

    button.click();

    expect(component.showRight).not.toBeTrue();

    button.click();

    expect(component.showRight).toBeTrue();
  });

  it('check get permissions', () =>
  {
    permissionService=TestBed.inject(PermissionService);

    spyOn(permissionService, 'canView').and.returnValue(new Observable<boolean>());

    fixture.detectChanges();

    component.ngOnInit();

    expect(permissionService.canView).toHaveBeenCalledTimes(1);
  });
});
