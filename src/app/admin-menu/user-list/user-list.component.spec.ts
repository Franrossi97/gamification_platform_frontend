import { PermissionService } from './../../services/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './../../services/user.service';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/User';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService;
  let permissionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      imports: [HttpClientModule, RouterTestingModule, FontAwesomeModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all users and permissions', () =>
  {
    userService=TestBed.inject(UserService);
    permissionService=TestBed.inject(PermissionService);

    spyOn(userService, 'getAllUsers').and.returnValue(new Observable<Array<User>>());
    spyOn(permissionService, 'canEdit').and.returnValue(Promise);

    component.ngOnInit();

    expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(permissionService.canEdit).toHaveBeenCalledTimes(1);
  });

  it('check inactivate button', (done) =>
  {
    component.ngOnInit();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.canEdit=true;
      userService= TestBed.inject(UserService);
      spyOn(userService, 'inactivateUser').and.returnValue(new Observable<any>());

      fixture.detectChanges();
      fixture.whenStable();
      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#inactivate');

      button.click();

      expect(userService.inactivateUser).toHaveBeenCalledTimes(1);
      done();
      flush();
    }));
  });

  it('check activate button', (done) =>
  {
    component.ngOnInit();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.canEdit=true;
      userService= TestBed.inject(UserService);
      spyOn(userService, 'activateUser').and.returnValue(new Observable<any>());

      fixture.detectChanges();
      fixture.whenStable();
      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#activate');

      button.click();

      expect(userService.activateUser).toHaveBeenCalledTimes(1);
      done();
      flush();
    }));
  });

  it('check delete button', (done) =>
  {
    component.ngOnInit();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.canEdit=true;
      userService= TestBed.inject(UserService);
      spyOn(userService, 'removeUser').and.returnValue(new Observable<any>());

      fixture.detectChanges();
      fixture.whenStable();
      const button: HTMLButtonElement= fixture.debugElement.nativeElement.querySelector('#delete');

      button.click();

      expect(userService.removeUser).toHaveBeenCalledTimes(1);
      done();
      flush();
    }));
  });
});
