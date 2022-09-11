import { HttpErrorResponse } from '@angular/common/http';
import { containsSpecialCharacter, containsNumber, containsMayus } from 'src/app/shared/validators/strengths-validators';
import { UserService } from './../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NewUser } from '../shared/NewUser';
import { Router } from '@angular/router';

const passwordMatching: ValidatorFn = (control: UntypedFormGroup): ValidationErrors | null => {

  const password = control.controls['password'];
  const confirmPassword = control.controls['repeatpassword'];

  return password?.value == confirmPassword?.value ? null : { mustMatch: true };
};

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit
{
  newUserError: boolean=false;
  newUserForm: UntypedFormGroup;
  private loadingLogin: boolean= false;
  private successMessage: boolean= false;
  private errorMessage: string;

  @ViewChild('fform') newSubjectFormDirective;
  constructor(private fb: UntypedFormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void
  {
    this.createForm();
  }

  createForm()
  {
    this.newUserForm=this.fb.group(
    {
      name: new UntypedFormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(25)]),
      lastname: new UntypedFormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(25)]),
      mail: new UntypedFormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40), Validators.email]),
      passwordmenu: this.fb.group({
        password: new UntypedFormControl(null, [Validators.required,Validators.minLength(10),
          Validators.maxLength(35), containsSpecialCharacter(), containsNumber(), containsMayus()]),

        repeatpassword: new UntypedFormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(35)])
      },
      {
        validators: passwordMatching,
      }),
      enrollment: new UntypedFormControl(null, [Validators.required,Validators.minLength(5),Validators.maxLength(8)]),
    });
  }

  onSubmit()
  {
    let newUser=new NewUser (this.newUserForm.get('name').value, this.newUserForm.get('lastname').value,
    this.newUserForm.get('enrollment').value, this.newUserForm.get('mail').value,
    this.newUserForm.get('passwordmenu.password').value, false, 2);

    this.loadingLogin=true;
    this.userService.registerUser(newUser).subscribe(data =>
    {
      this.loadingLogin=false;
      this.successMessage=true;
      setTimeout(() => this.router.navigate(['login']), 3000);
    },
    (error: HttpErrorResponse) =>
    {
      const message: string= error.error.message;
      if(message.includes('mail')) {
        this.errorMessage='El email ya existe en la plataforma. Utilice otro';
      } else {
        this.errorMessage='Ocurrió un error al ingresar el usuario';
      }
      this.loadingLogin=false;
      this.newUserError=true;
    });
  }

  getLoadingLogin() {
    return this.loadingLogin;
  }

  getSuccessMessage() {
    return this.successMessage;
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
