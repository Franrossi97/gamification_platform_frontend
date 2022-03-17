import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { Permission } from 'src/app/shared/Permission';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { EditUserComponent } from './edit-user.component';
import { User } from 'src/app/shared/User';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let userService;
  let permissionService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id_usuario: 1}))
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;

    permissionService= TestBed.inject(PermissionService);
    userService=TestBed.inject(UserService);

    let arrayInsert=new Array<User>();
    arrayInsert.push(new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1));

    spyOn(permissionService, 'getPermissions').and.returnValue(of([new Permission(1, 'Profesor'), new Permission(2, 'Estudiante'), new Permission(3, 'Administrador')]));
    spyOn(component, 'getUserInformation').and.resolveTo(arrayInsert);

    fixture.detectChanges();

    //component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
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

  it('check form creation', (done) =>
  {
    fixture.whenStable().then(() =>
    {
      expect(component.editUserForm).not.toBeNull();

      done();
    });
  });

  it('check form elements count', (done) =>
  {
    component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

    component.createEditUserForm();

    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      const formElementInputs= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input');
      const selectElement= fixture.debugElement.nativeElement.querySelector('select');

      expect(formElementInputs.length).toEqual(4);
      expect(selectElement).not.toBeNull();

      done();
      flush();
    }));
  });

  it('check initial values', () =>
  {
    component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
    component.createEditUserForm();

    const editUserFormGroup= component.editUserForm;
    const editUserFormValues=
    {
      name: component.user.nombre,
      lastname: component.user.apellido,
      email: component.user.mail,
      enrollment: component.user.matricula,
      profile: component.user.perfil,
    }

    expect(editUserFormGroup.value).toEqual(editUserFormValues);
  });

  it('check name value before entering value', (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

      component.createEditUserForm();

      fixture.detectChanges();

      fixture.whenStable();

      const nameFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[0];
      const nameFormGroup= component.editUserForm.get('name');

      expect(nameFormElement.value).toEqual(nameFormGroup.value);

      done();
      flush();
    }));
  });

  it('check name value after entering value', (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
      component.createEditUserForm();

      fixture.detectChanges();

      const nameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[0];
      const nameFormGroup= component.editUserForm.get('name');

      nameFormElement.value='';
      nameFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      expect(nameFormElement.value).toEqual(nameFormGroup.value);
      expect(nameFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));

  });

  it('check lastname value before entering value', (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

      component.createEditUserForm();

      fixture.detectChanges();

      fixture.whenStable();

      const lastNameFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[1];
      const lastNameFormGroup= component.editUserForm.get('lastname');

      expect(lastNameFormElement.value).toEqual(lastNameFormGroup.value);

      done();
      flush();
    }));
  });

  it('check lastname value after entering value', (done) =>
  {
    component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
    component.createEditUserForm();

    fixture.detectChanges();

    fixture.whenStable().then(() =>
    {
      const lastNameFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[1];
      const lastNameFormGroup= component.editUserForm.get('lastname');

      lastNameFormElement.value='Test';
      lastNameFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges(); fixture.whenStable();

      expect(lastNameFormElement.value).toEqual(lastNameFormGroup.value);
      expect(lastNameFormGroup.errors).toBeNull();

      done();
    });

  });

  it('check enrollment value before entering value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      //component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

      component.createEditUserForm();

      fixture.detectChanges();

      fixture.whenStable();

      const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[2];
      const enrollmentFormGroup= component.editUserForm.get('enrollment');

      expect(enrollmentFormElement.value).toEqual(enrollmentFormGroup.value);

      flush();
      done();
    }));
  });

  it('check enrollment value after entering value', (done) =>
  {
    //component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
    //component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.createEditUserForm();

      fixture.detectChanges();
      fixture.whenStable();

      const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[2];
      const enrollmentFormGroup= component.editUserForm.get('enrollment');

      enrollmentFormElement.value='';
      enrollmentFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      expect(enrollmentFormElement.value).toEqual(enrollmentFormGroup.value==null ? '' : enrollmentFormGroup.value);
      expect(enrollmentFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));

  });

  it('check email value before entering value', (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

      component.createEditUserForm();

      fixture.detectChanges();

      fixture.whenStable();

      const emailFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[3];
      const emailFormGroup= component.editUserForm.get('email');

      expect(emailFormElement.value).toEqual(emailFormGroup.value);

      done();
      flush();
    }));
  });

  it('check email value after entering value', (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
      component.createEditUserForm();

      fixture.detectChanges();

      fixture.whenStable();

      const emailFormElement: HTMLInputElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[3];
      const emailFormGroup= component.editUserForm.get('email');

      emailFormElement.value='';
      emailFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      console.log(emailFormGroup.value);
      expect(emailFormElement.value).toEqual(emailFormGroup.value.toString());
      expect(emailFormGroup.errors).not.toBeNull();

      done();
      flush();
    }));

  });

  it('check profile value before entering value', (done) =>
  {
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      component.createEditUserForm();

      await fixture.detectChanges();
      await fixture.whenStable();

      const profileFormElement= fixture.debugElement.nativeElement.querySelector('#profileInfo');
      const profileFormGroup= component.editUserForm.get('profile');

      expect(profileFormElement.value).toEqual(profileFormGroup.value == null ? '' : profileFormGroup.value.toString());
      expect(profileFormGroup.errors).toBeNull();

      done();
    });
  });

  it('check profile value after entering value', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.createEditUserForm();
      component.ngOnInit();

      fixture.detectChanges();
      fixture.whenStable();

      const profileFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('select');
      const profileFormGroup= component.editUserForm.get('profile');

      profileFormElement.value= profileFormElement.options[1].value;
      profileFormElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();
      fixture.whenStable();

      expect(profileFormElement.value).toEqual(profileFormGroup.value);
      expect(profileFormGroup.errors).toBeNull();

      done();
      flush();
    }));

  });

  it('check the whole form values and validations', (done) =>
  {
    fixture.detectChanges();

    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);

      component.createEditUserForm();

      fixture.detectChanges();

      fixture.whenStable();

      const nameFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[0];
      const lastnameFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[1];
      const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[2];
      const emailFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[3];
      const profileFormElement: HTMLSelectElement= fixture.debugElement.nativeElement.querySelector('select');

      nameFormElement.value='Test';
      lastnameFormElement.value='Test';
      enrollmentFormElement.value=11792;
      emailFormElement.value='Test@gmail.com';
      profileFormElement.value= profileFormElement.options[1].value;

      nameFormElement.dispatchEvent(new Event('input'));
      lastnameFormElement.dispatchEvent(new Event('input'));
      enrollmentFormElement.dispatchEvent(new Event('input'));
      emailFormElement.dispatchEvent(new Event('input'));
      profileFormElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      fixture.whenStable().then(() =>
      {
        expect(component.editUserForm.valid).toBeTruthy();

        done();
        flush();
      });
    }));
  });

  //Por el select no puedo hacer correctamente el testing del boton
  it('check button calling service', (done) =>
  {
    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.user=new User(0, 'Test', 'Test', '11792', 'test@gmail.com', null, 1);
      component.createEditUserForm();

      fixture.detectChanges();
      fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#submitUser');

      const nameFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[0];
      const lastnameFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[1];
      const enrollmentFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[2];
      const emailFormElement= fixture.debugElement.nativeElement.querySelector('#userEditForm').querySelectorAll('input')[3];

      nameFormElement.value='Test';
      lastnameFormElement.value='Test';
      enrollmentFormElement.value=11792;
      emailFormElement.value='Test@gmail.com';

      nameFormElement.dispatchEvent(new Event('input'));
      lastnameFormElement.dispatchEvent(new Event('input'));
      enrollmentFormElement.dispatchEvent(new Event('input'));
      emailFormElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable();

      spyOn(userService, 'editUser').and.returnValue(new Observable<any>());

      fixture.detectChanges();
      button.click();

      expect(userService.editUser).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('check get user information called', (done) =>
  {
    //component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(async () =>
    {
      await fixture.detectChanges();
      await fixture.whenStable();

      expect(component.getUserInformation).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
