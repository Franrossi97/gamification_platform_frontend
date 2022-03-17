import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UserRegisterComponent } from './user-register.component';
import { UserService } from '../services/user.service';
import { NewUser } from '../shared/NewUser';
import { observable, Observable } from 'rxjs';

describe('UserRegisterComponent', () => {
  let component: UserRegisterComponent;
  let fixture: ComponentFixture<UserRegisterComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRegisterComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FormsModule],
      providers: [UserService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be form length 5', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputElement=formElement.querySelectorAll('input');
    expect(inputElement.length).toEqual(5);
  });

  it('initial values of forms', () =>
  {
    const actualForm=component.newUserForm;
    const testForm=
    {
      name: null,
      lastname: null,
      mail: null,
      password: null,
      enrollment: null,
    }

    expect(actualForm.value).toEqual(testForm);
  });

  it('name value and validation before entering the value', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputNameElement=formElement.querySelectorAll('input')[0];
    const actualInputName=component.newUserForm.get('name');

    expect(inputNameElement.value).toEqual(actualInputName.value == null ? '' : actualInputName.value);
    expect(actualInputName.errors).not.toBeNull();
    expect(actualInputName.errors.required).toBeTruthy();
  });

  it('name value and validation after entering the value', async () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputNameElement=formElement.querySelectorAll('input')[0];

    inputNameElement.value='Test';
    inputNameElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {

      const actualInputName=component.newUserForm.get('name');
      expect(inputNameElement.value).toEqual(actualInputName.value);
      expect(actualInputName.errors).toBeNull();
    });
  });

  it('lastname value and validation before entering the value', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputLastNameElement=formElement.querySelectorAll('input')[1];
    const actualInputLastName=component.newUserForm.get('lastname');

    expect(inputLastNameElement.value).toEqual(actualInputLastName.value == null ? '' : actualInputLastName.value);
    expect(actualInputLastName.errors).not.toBeNull();
    expect(actualInputLastName.errors.required).toBeTruthy();
  });

  it('lastname value and validation after entering the value', async () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputLastNameElement=formElement.querySelectorAll('input')[1];

    inputLastNameElement.value='Test';
    inputLastNameElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {

      const actualInputLastName=component.newUserForm.get('lastname');
      expect(inputLastNameElement.value).toEqual(actualInputLastName.value);
      expect(actualInputLastName.errors).toBeNull();
    });
  });

  it('email value and validation before entering the value', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputEmailElement=formElement.querySelectorAll('input')[2];
    const actualInputEmail=component.newUserForm.get('mail');

    expect(inputEmailElement.value).toEqual(actualInputEmail.value == null ? '' : actualInputEmail.value);
    expect(actualInputEmail.errors).not.toBeNull();
    expect(actualInputEmail.errors.required).toBeTruthy();
  });

  it('mail value and validation after entering the value', async () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputEmailElement=formElement.querySelectorAll('input')[2];

    inputEmailElement.value='Test@gmail.com';
    inputEmailElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {

      const actualInputEmail=component.newUserForm.get('mail');
      expect(inputEmailElement.value).toEqual(actualInputEmail.value);
      expect(actualInputEmail.errors).toBeNull();
    });
  });

  it('password value and validation before entering the value', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputPasswordElement=formElement.querySelectorAll('input')[3];
    const actualInputPassword=component.newUserForm.get('password');

    expect(inputPasswordElement.value).toEqual(actualInputPassword.value == null ? '' : actualInputPassword.value);
    expect(actualInputPassword.errors).not.toBeNull();
    expect(actualInputPassword.errors.required).toBeTruthy();
  });

  it('password value and validation after entering the value', async () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputPasswordElement=formElement.querySelectorAll('input')[3];

    inputPasswordElement.value='testtesttest';
    inputPasswordElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {

      const actualInputPassword=component.newUserForm.get('password');
      expect(inputPasswordElement.value).toEqual(actualInputPassword.value);
      expect(actualInputPassword.errors).toBeNull();
    });
  });

  it('enrollment value and validation before entering the value', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputEnrollmentElement=formElement.querySelectorAll('input')[4];
    const actualInputEnrollment=component.newUserForm.get('enrollment');

    expect(inputEnrollmentElement.value).toEqual(actualInputEnrollment.value == null ? '' : actualInputEnrollment.value);
    expect(actualInputEnrollment.errors).not.toBeNull();
    expect(actualInputEnrollment.errors.required).toBeTruthy();
  });

  it('enrollment value and validation after entering the value', async () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputEnrollmentElement=formElement.querySelectorAll('input')[4];

    inputEnrollmentElement.value=11792;
    inputEnrollmentElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {

      const actualInputEnrollment=component.newUserForm.get('enrollment');
      expect(inputEnrollmentElement.value).toEqual(actualInputEnrollment.value);
      expect(actualInputEnrollment.errors).toBeNull();
    });
  });

  it('whole forms should be valid', async () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputNameElement=formElement.querySelectorAll('input')[0];
    const inputlastNameElement=formElement.querySelectorAll('input')[1];
    const inputEmailElement=formElement.querySelectorAll('input')[2];
    const inputPasswordElement=formElement.querySelectorAll('input')[3];
    const inputEnrollmentElement=formElement.querySelectorAll('input')[4];

    inputNameElement.value='Test';
    inputlastNameElement.value='Testito';
    inputEmailElement.value='test@gmail.com';
    inputPasswordElement.value='testesttest';
    inputEnrollmentElement.value='11792';

    inputNameElement.dispatchEvent(new Event('input'));
    inputlastNameElement.dispatchEvent(new Event('input'));
    inputEmailElement.dispatchEvent(new Event('input'));
    inputPasswordElement.dispatchEvent(new Event('input'));
    inputEnrollmentElement.dispatchEvent(new Event('input'));
    const loginValid=component.newUserForm.valid;

    fixture.detectChanges();

    fixture.whenStable().then(() => {

      expect(loginValid).toBeTruthy();
    });
  });

  it('save the user', fakeAsync(() =>
  {
    userService=TestBed.inject(UserService);

    spyOn(userService, 'registerUser').and.returnValue(new Observable<any>());

    fixture.detectChanges();

    const formElement=fixture.debugElement.nativeElement.querySelector('#userRegisterForm');
    const inputNameElement=formElement.querySelectorAll('input')[0];
    const inputlastNameElement=formElement.querySelectorAll('input')[1];
    const inputEmailElement=formElement.querySelectorAll('input')[2];
    const inputPasswordElement=formElement.querySelectorAll('input')[3];
    const inputEnrollmentElement=formElement.querySelectorAll('input')[4];

    inputNameElement.value='Test';
    inputlastNameElement.value='Testito';
    inputEmailElement.value='test@gmail.com';
    inputPasswordElement.value='testesttest';
    inputEnrollmentElement.value='11792';

    component.onSubmit();

    expect(userService.registerUser).toHaveBeenCalledTimes(1);

  }));
});
