import { UserService } from './../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { AddUserComponent } from './add-user.component';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let userService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.message).toBeNull();
    expect(component.successful).not.toBeTrue();
  });

  it('check form creation', () =>
  {
    const formElement=fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input');

    expect(formElement.length).toEqual(1);
  });

  it('check initial values', () =>
  {
    const searchFormGroup= component.searchUserForm;
    const searchValue={
      email: null
    }

    expect(searchFormGroup.value).toEqual(searchValue);
  });

  it('check email validations before values', () =>
  {
    const emailFormElement=fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const emailFormGroup=component.searchUserForm.get('email');

    expect(emailFormElement.value).toEqual(emailFormGroup.value==null ? '' : emailFormGroup.value);
    expect(emailFormGroup.errors).not.toBeNull();
    expect(emailFormGroup.errors.required).toBeTruthy();
  });

  it('check email validations after values', (done) =>
  {
    const emailFormElement=fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const emailFormGroup=component.searchUserForm.get('email');

    emailFormElement.value='test@gmail.com';
    emailFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(emailFormElement.value).toEqual(emailFormGroup.value);
      expect(emailFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check general form validation', (done) =>
  {
    const emailFormElement=fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const emailFormGroup=component.searchUserForm.get('email');

    emailFormElement.value='test@gmail.com';
    emailFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      expect(component.searchUserForm.valid).toBeTruthy();

      done();
    });
  });

  it('check search button calling service', (done) =>
  {
    userService=TestBed.inject(UserService);

    spyOn(userService, 'searchUser');

    const emailFormElement=fixture.debugElement.nativeElement.querySelector('#searchForm').querySelectorAll('input')[0];
    const button= fixture.debugElement.nativeElement.querySelector('#searchButton')

    emailFormElement.value='test@gmail.com';
    emailFormElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      button.click();

      expect(userService.searchUser).toHaveBeenCalledTimes(1);

      flush();
      done();
    }));
  });
});
