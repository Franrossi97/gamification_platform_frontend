import { containsSpecialCharacter, containsNumber, containsMayus } from 'src/app/shared/validators/strengths-validators';
import { UserService } from './../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NewUser } from '../shared/NewUser';
import { Router } from '@angular/router';

const passwordMatching: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

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
  newUserForm: FormGroup;
  private loadingLogin: boolean= false;
  private successMessage: boolean= false;

  @ViewChild('fform') newSubjectFormDirective;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void
  {
    this.createForm();
  }

  createForm()
  {
    this.newUserForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(25)]),
      lastname: new FormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(25)]),
      mail: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40), Validators.email]),
      passwordmenu: this.fb.group({
        password: new FormControl(null, [Validators.required,Validators.minLength(10),
          Validators.maxLength(35), containsSpecialCharacter(), containsNumber(), containsMayus()]),

        repeatpassword: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(35)])
      },
      {
        validators: passwordMatching,
      }),
      enrollment: new FormControl(null, [Validators.required,Validators.minLength(5),Validators.maxLength(8)]),
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
    error =>
    {
      console.log(error);
      this.newUserError=true;
    });
  }

  getLoadingLogin() {
    return this.loadingLogin;
  }

  getSuccessMessage() {
    return this.successMessage;
  }
}
