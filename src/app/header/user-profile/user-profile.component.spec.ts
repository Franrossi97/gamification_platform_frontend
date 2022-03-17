import { User } from './../../shared/User';
import { UserService } from './../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { Observable } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService;
  localStorage.setItem('userId', '1');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.user=new User(null, null, null, null, null, null, null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get user information', fakeAsync(() =>
  {
    userService=TestBed.inject(UserService);

    spyOn(userService, 'searchUser').and.returnValue(new Observable<User>());

    fixture.detectChanges();

    component.ngOnInit();

    expect(userService.searchUser).toHaveBeenCalledTimes(1);
    flush();
  }));

  it('check on edit button action', async (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const button=fixture.debugElement.nativeElement.querySelector('#editInfo');

      button.click();

      expect(component.editing).toBeTrue();

      done();
      flush();
    }));

  });

  it('check form creation', async (done) =>
  {
    component.user=await new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputElements= formElement.querySelectorAll('input');

      expect(inputElements.length).toEqual(4);

      done();
      flush();
    }));
  });

  it('check initial values on creation', async(done: DoneFn) =>
  {
    component.user=new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const editFormGroup=component.userInfoForm;
      const editFormValues=
      {
        nombre: 'Test',
        apellido: 'Test',
        mail: 'test@gmail.com',
        matricula: 11792,
      }

      expect(editFormGroup.value).toEqual(editFormValues);

      done();
      flush();
    }));
  });

  it('check nombre before entering values', async(done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputNombreElements= formElement.querySelectorAll('input')[0];

      const nombreFormGroup= component.userInfoForm.get('nombre');

      expect(inputNombreElements.value).toEqual(nombreFormGroup.value);

      expect(nombreFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });


  it('check nombre after entering values', async(done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputNombreElements= formElement.querySelectorAll('input')[0];

      inputNombreElements.value='';
      inputNombreElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const nombreFormGroup= component.userInfoForm.get('nombre');

      expect(inputNombreElements.value).toEqual(nombreFormGroup.value);
      expect(nombreFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));

  });

  it('check apellido before entering values', async(done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputApellidoElements= formElement.querySelectorAll('input')[1];

      const apellidoFormGroup= component.userInfoForm.get('apellido');

      expect(inputApellidoElements.value).toEqual(apellidoFormGroup.value);
      expect(apellidoFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });


  it('check apellido after entering values', async(done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputApellidoElements= formElement.querySelectorAll('input')[1];

      inputApellidoElements.value='';
      inputApellidoElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const apellidoFormGroup= component.userInfoForm.get('apellido');

      expect(inputApellidoElements.value).toEqual(apellidoFormGroup.value);
      expect(apellidoFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));

  });

  it('check mail before entering values', async(done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputMailElements= formElement.querySelectorAll('input')[2];

      const mailFormGroup= component.userInfoForm.get('mail');

      expect(inputMailElements.value).toEqual(mailFormGroup.value);
      expect(mailFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });


  it('check mail after entering values', async (done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputMailElements= formElement.querySelectorAll('input')[2];

      inputMailElements.value='';
      inputMailElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();
      const mailFormGroup= component.userInfoForm.get('mail');

      expect(inputMailElements.value).toEqual(mailFormGroup.value);
      expect(mailFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));
  });

  it('check matricula before entering values', async (done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputMatriculaElements= formElement.querySelectorAll('input')[3];

      const matriculaFormGroup= component.userInfoForm.get('matricula');

      expect(inputMatriculaElements.value).toEqual(matriculaFormGroup.value.toString());
      expect(matriculaFormGroup.errors).toBeNull();
      done();
      flush();
    }));
  });


  it('check matricula after entering values', async(done: DoneFn) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#profileEditForm');
      const inputMatriculaElements= formElement.querySelectorAll('input')[3];

      inputMatriculaElements.value='';
      inputMatriculaElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const matriculaFormGroup= component.userInfoForm.get('matricula');

      expect(inputMatriculaElements.value).toEqual(matriculaFormGroup.value);
      expect(matriculaFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));
  });

  it('check all values and validations of profile form', async(done) =>
  {
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const nombreElements= fixture.debugElement.nativeElement.querySelector('#profileEditForm').querySelectorAll('input')[0];
      const apellidoElements= fixture.debugElement.nativeElement.querySelector('#profileEditForm').querySelectorAll('input')[1];
      const mailElements= fixture.debugElement.nativeElement.querySelector('#profileEditForm').querySelectorAll('input')[2];
      const inputMatriculaElements= fixture.debugElement.nativeElement.querySelector('#profileEditForm').querySelectorAll('input')[3];

      nombreElements.value='';
      apellidoElements.value='';
      mailElements.value='';
      inputMatriculaElements.value='';

      nombreElements.dispatchEvent(new Event('input'));
      apellidoElements.dispatchEvent(new Event('input'));
      mailElements.dispatchEvent(new Event('input'));
      inputMatriculaElements.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.userInfoForm.valid).not.toBeTruthy();

      done();
      flush();
    }));
  });

  it('check change password creation form', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElement= fixture.debugElement.nativeElement.querySelector('#passwordForm');
      const inputElements= formElement.querySelectorAll('input');
      expect(inputElements.length).toEqual(3);

      done();
      flush();
    }));
  });

  it('check form values before inserting them', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordForm=component.passwordForm;
      const passwordFormValues=
      {
        password: null,
        newpassword: null,
        repeatnewpassword: null,
      }

      expect(passwordForm.value).toEqual(passwordFormValues);

      done();
      flush();
    }));
  });

  it('check password value before inserting a value', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[0];
      const passwordFormGroup=component.passwordForm.get('password');

      expect(passwordInputElement.value).toEqual(passwordFormGroup.value==null ? '' : passwordFormGroup.value);
      expect(passwordFormGroup.errors).not.toBeNull();
      expect(passwordFormGroup.errors.required).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check password value after inserting a value', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[0];
      passwordInputElement.value='testtest';
      passwordInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();
      const passwordFormGroup=component.passwordForm.get('password');

      expect(passwordInputElement.value).toEqual(passwordFormGroup.value);
      expect(passwordFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check newpassword value before inserting a value', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[1];
      const passwordFormGroup=component.passwordForm.get('newpassword');

      expect(passwordInputElement.value).toEqual(passwordFormGroup.value==null ? '' : passwordFormGroup.value);
      expect(passwordFormGroup.errors).not.toBeNull();
      expect(passwordFormGroup.errors.required).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check newpassword value after inserting a value', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[1];
      passwordInputElement.value='!Testtest1';
      passwordInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();
      const passwordFormGroup=component.passwordForm.get('newpassword');

      expect(passwordInputElement.value).toEqual(passwordFormGroup.value);
      expect(passwordFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check repeatnewpassword value before inserting a value', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[2];
      const passwordFormGroup=component.passwordForm.get('repeatnewpassword');

      expect(passwordInputElement.value).toEqual(passwordFormGroup.value==null ? '' : passwordFormGroup.value);
      expect(passwordFormGroup.errors).not.toBeNull();
      expect(passwordFormGroup.errors.required).toBeTruthy();

      done();
      flush();
    }));
  });

  it('check repeatnewpassword value after inserting a value', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[1];
      const repeatNewPasswordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[2];
      passwordInputElement.value='!Testtest1';

      repeatNewPasswordInputElement.value='!Testtest1';
      repeatNewPasswordInputElement.dispatchEvent(new Event('input'));
      passwordInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();
      const passwordFormGroup=component.passwordForm.get('repeatnewpassword');

      expect(repeatNewPasswordInputElement.value).toEqual(passwordFormGroup.value);
      expect(passwordFormGroup.errors).toBeNull();

      done();
      flush();
    }));
  });

  it('check all values and validations of password form', async (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();

    fixture.whenStable().then( fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[0];
      const newPasswordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[1];
      const repeatNewPasswordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[2];

      passwordInputElement.value='testtest';
      newPasswordInputElement.value='!Testtest1';
      repeatNewPasswordInputElement.value='!Testtest1';

      passwordInputElement.dispatchEvent(new Event('input'));
      newPasswordInputElement.dispatchEvent(new Event('input'));
      repeatNewPasswordInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();
      expect(component.passwordForm.valid).toBeTruthy();

      done();
      flush();
    }));
  });

  it('when pressing cancel button', (done) =>
  {
    component.onEditInfo();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const button= fixture.debugElement.nativeElement.querySelector('#cancelEditInfo');

      button.click();

      expect(component.editing).not.toBeTrue();
      expect(component.userInfoForm).toBeNull();

      done();
      flush();
    }));
  });

  it('when pressing cancel button for password', (done) =>
  {
    component.onEditPassword();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const button= fixture.debugElement.nativeElement.querySelector('#cancelPassword');

      button.click();

      expect(component.editingPassword).not.toBeTrue();
      expect(component.passwordForm).toBeNull();

      done();
      flush();
    }));
  });

  it('when pressing submit button for info', (done) =>
  {
    userService=TestBed.inject(UserService);
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditInfo();

    spyOn(userService, 'editUser').and.returnValue(new Observable<any>());
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const button= fixture.debugElement.nativeElement.querySelector('#submitInfo');

      button.click();

      expect(component.newInfoUser).toEqual(new User(undefined, 'Test', 'Test', '11792', 'test@gmail.com', undefined, undefined));
      expect(userService.editUser).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('when pressing submit button for info', (done) =>
  {
    userService=TestBed.inject(UserService);
    component.user= new User(null, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.onEditPassword();

    spyOn(userService, 'changePassword').and.returnValue(new Observable<any>());
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const passwordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[0];
      const newPasswordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[1];
      const repeatNewPasswordInputElement= fixture.debugElement.nativeElement.querySelector('#passwordForm').querySelectorAll('input')[2];

      passwordInputElement.value='testtest';
      newPasswordInputElement.value='!Testtest1';
      repeatNewPasswordInputElement.value='!Testtest1';

      passwordInputElement.dispatchEvent(new Event('input'));
      newPasswordInputElement.dispatchEvent(new Event('input'));
      repeatNewPasswordInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#submitPassword');

      button.click();

      expect(userService.changePassword).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

});
