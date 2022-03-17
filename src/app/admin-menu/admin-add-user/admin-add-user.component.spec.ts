import { UserService } from './../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Permission } from 'src/app/shared/Permission';

import { AdminAddUserComponent } from './admin-add-user.component';
import { Observable } from 'rxjs';

describe('AddUserComponent', () => {
  let component: AdminAddUserComponent;
  let fixture: ComponentFixture<AdminAddUserComponent>;
  let userService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddUserComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check the permissions names', (done) =>
  {
    const permissionsName=new Array<Permission>();

    permissionsName.push(new Permission(1, 'Profesor'));
    permissionsName.push(new Permission(2, 'Estudiante'));
    permissionsName.push(new Permission(3, 'Administrador'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(component.permissionsName[0].id_perfil).toEqual(permissionsName[0].id_perfil);
      expect(component.permissionsName[0].nombre).toEqual(permissionsName[0].nombre);
      expect(component.permissionsName[1].id_perfil).toEqual(permissionsName[1].id_perfil);
      expect(component.permissionsName[1].nombre).toEqual(permissionsName[1].nombre);
      expect(component.permissionsName[2].id_perfil).toEqual(permissionsName[2].id_perfil);
      expect(component.permissionsName[2].nombre).toEqual(permissionsName[2].nombre);

      done();
    });
  });

  it('check form creation', () =>
  {
    expect(component.newUserForm).not.toBeNull();
  });

  it('check form elements count', () =>
  {
    const formElementInputs= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input');
    const selectElement= fixture.debugElement.nativeElement.querySelector('select');

    expect(formElementInputs.length).toEqual(5);
    expect(selectElement).not.toBeNull();
  });

  it('check initial values', () =>
  {
    const newUserFormGroup= component.newUserForm;
    const newUserFormValues=
    {
      name:null,
      lastname:null,
      email: null,
      enrollment: null,
      profile: null,
      password: 'Gamificacion2022'
    }

    expect(newUserFormGroup.value).toEqual(newUserFormValues);
  });

  it('check name value before entering value', () =>
  {
    const nameFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[0];
    const nameFormGroup= component.newUserForm.get('name');

    expect(nameFormElement.value).toEqual(nameFormGroup.value == null ? '' : nameFormGroup.value);
    expect(nameFormGroup.errors).not.toBeNull();
    expect(nameFormGroup.errors.required).toBeTruthy();
  });

  it('check name value after entering value', (done) =>
  {
    const nameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[0];
    const nameFormGroup= component.newUserForm.get('name');

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

  it('check lastname value before entering value', () =>
  {
    const lastNameFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[1];
    const lastNameFormGroup= component.newUserForm.get('lastname');

    expect(lastNameFormElement.value).toEqual(lastNameFormGroup.value == null ? '' : lastNameFormGroup.value);
    expect(lastNameFormGroup.errors).not.toBeNull();
    expect(lastNameFormGroup.errors.required).toBeTruthy();
  });

  it('check lastname value after entering value', (done) =>
  {
    const lastNameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[1];
    const lastNameFormGroup= component.newUserForm.get('lastname');

    lastNameFormElement.value='Test';
    lastNameFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(lastNameFormElement.value).toEqual(lastNameFormGroup.value);
      expect(lastNameFormGroup.errors).toBeNull();

      done();
    });

  });

  it('check email value before entering value', () =>
  {
    const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[2];
    const enrollmentFormGroup= component.newUserForm.get('enrollment');

    expect(enrollmentFormElement.value).toEqual(enrollmentFormGroup.value == null ? '' : enrollmentFormGroup.value);
    expect(enrollmentFormGroup.errors).not.toBeNull();
    expect(enrollmentFormGroup.errors.required).toBeTruthy();
  });

  it('check email value after entering value', (done) =>
  {
    const enrollmentFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[2];
    const enrollmentFormGroup= component.newUserForm.get('enrollment');

    enrollmentFormElement.value='11792';
    enrollmentFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(enrollmentFormElement.value).toEqual(enrollmentFormGroup.value.toString());
      expect(enrollmentFormGroup.errors).toBeNull();

      done();
    });

  });

  it('check email value before entering value', () =>
  {
    const emailFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[3];
    const emailFormGroup= component.newUserForm.get('email');

    expect(emailFormElement.value).toEqual(emailFormGroup.value == null ? '' : emailFormGroup.value);
    expect(emailFormGroup.errors).not.toBeNull();
    expect(emailFormGroup.errors.required).toBeTruthy();
  });

  it('check email value after entering value', (done) =>
  {
    const emailFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[3];
    const emailFormGroup= component.newUserForm.get('email');

    emailFormElement.value='Test@gmail.com';
    emailFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(emailFormElement.value).toEqual(emailFormGroup.value);
      expect(emailFormGroup.errors).toBeNull();

      done();
    });

  });

  it('check password value before entering value', () =>
  {
    const passwordFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[4];
    const passwordFormGroup= component.newUserForm.get('password');

    expect(passwordFormElement.value).toEqual(passwordFormGroup.value == null ? '' : passwordFormGroup.value);
    expect(passwordFormGroup.errors).toBeNull();
  });

  it('check password value after entering value', (done) =>
  {
    const passwordFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[4];
    const passwordFormGroup= component.newUserForm.get('password');

    passwordFormElement.value='!Test123';
    passwordFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(passwordFormElement.value).toEqual(passwordFormGroup.value);
      expect(passwordFormGroup.errors).toBeNull();

      done();
    });

  });

  it('check profile value before entering value', () =>
  {
    const profileFormElement= fixture.debugElement.nativeElement.querySelector('select');
    const profileFormGroup= component.newUserForm.get('profile');

    expect(profileFormElement.value).toEqual(profileFormGroup.value == null ? '' : profileFormGroup.value);
    expect(profileFormGroup.errors).not.toBeNull();
  });

  //CANCELADO EL TEST DE SELECT
  /*
  it('check profile value after entering value', (done) =>
  {
    fixture.detectChanges();

    const profileFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('select');
    const profileFormGroup= component.newUserForm.get('profile');

    fixture.whenStable().then(fakeAsync(() =>
    {
      console.log(component.permissionsName);
      console.log(profileFormElement);
      console.log(profileFormElement.options);

      profileFormElement.value= profileFormElement.options[0].value;
      profileFormElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(profileFormElement.value).toEqual(profileFormGroup.value);
      expect(profileFormGroup.errors).toBeNull();

      done();
      flush();
    }));

  });*/

  it('check the whole form values and validations', (done) =>
  {
    const nameFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[0];
    const lastnameFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[1];
    const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[2];
    const emailFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[3];
    const passwordFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[4];

    nameFormElement.value='Test';
    lastnameFormElement.value='Test';
    enrollmentFormElement.value=11792;
    emailFormElement.value='Test@gmail.com';
    passwordFormElement.value='!Test123';

    nameFormElement.dispatchEvent(new Event('input'));
    lastnameFormElement.dispatchEvent(new Event('input'));
    enrollmentFormElement.dispatchEvent(new Event('input'));
    emailFormElement.dispatchEvent(new Event('input'));
    passwordFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(component.newUserForm.get('name').valid).toBeTruthy();
      expect(component.newUserForm.get('lastname').valid).toBeTruthy();
      expect(component.newUserForm.get('enrollment').valid).toBeTruthy();
      expect(component.newUserForm.get('email').valid).toBeTruthy();
      expect(component.newUserForm.get('password').valid).toBeTruthy();

      done();
    });
  });

  //Por el select no puedo hacer correctamente el testing del boton
  it('check button calling service', (done) =>
  {
    const button= fixture.debugElement.nativeElement.querySelector('#submitUser');

    const nameFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[0];
    const lastnameFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[1];
    const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[2];
    const emailFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[3];
    const passwordFormElement= fixture.debugElement.nativeElement.querySelector('#userForm').querySelectorAll('input')[4];

    nameFormElement.value='Test';
    lastnameFormElement.value='Test';
    enrollmentFormElement.value=11792;
    emailFormElement.value='Test@gmail.com';
    passwordFormElement.value='!Test123';

    nameFormElement.dispatchEvent(new Event('input'));
    lastnameFormElement.dispatchEvent(new Event('input'));
    enrollmentFormElement.dispatchEvent(new Event('input'));
    emailFormElement.dispatchEvent(new Event('input'));
    passwordFormElement.dispatchEvent(new Event('input'));

    fixture.whenStable().then(() =>
    {
      userService=TestBed.inject(UserService);

      spyOn(userService, 'registerUser').and.returnValue(new Observable<any>());

      component.onSubmitUserInformation();

      fixture.detectChanges();
      //button.click();

      expect(userService.registerUser).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
