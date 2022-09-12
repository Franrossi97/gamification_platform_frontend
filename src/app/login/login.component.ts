import { HttpErrorResponse } from '@angular/common/http';
import { PermissionService } from './../services/permission.service';
import { NewUser } from './../shared/NewUser';
import { UserService } from './../services/user.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import {LoginUser} from '../shared/LoginUser';
import {Router} from '@angular/router'
import { Subscription } from 'rxjs';

const TRY_AGAIN_MESSAGE = 'Ocurrió un error al ingresar. Intente más tarde.';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy
{
  invalidLogin = false;
  loginUserForm: UntypedFormGroup;
  completeRegistrationForm: UntypedFormGroup;
  showRegistrationForm = false;
  socialUser: SocialUser;
  newExternalUser: NewUser;
  private loadingLogin = false;
  private authenticationProcess: Subscription;
  errorMessage = '';
  showErrorMessage = false;
  isExternalLogin = false;

  @ViewChild('fform') newSubjectFormDirective;
  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router:Router,
  private socialAuthService: SocialAuthService, private userService: UserService, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.createForm();

    this.subscribeAuthService();
    /*if(localStorage.getItem('currentUser')!==null)
      this.router.navigate(['home']);*/
  }

  createForm()
  {
    this.loginUserForm=this.fb.group(
    {
      mail: new UntypedFormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40)]),
      password: new UntypedFormControl(null, [Validators.required,Validators.minLength(5),Validators.maxLength(35)]),
    })
  }

  onSubmit()
  {
    this.loadingLogin=true;
    const loginUser: LoginUser=new LoginUser(this.loginUserForm.get('mail').value, this.loginUserForm.get('password').value);
    this.authService.authenticating(loginUser).subscribe(res =>
    {
      if(res.jwt)
      {
        this.loadNeededInformation(res);
      } else {
        this.invalidLoginMessageSet(TRY_AGAIN_MESSAGE)
      }

      this.loadingLogin=false;
    },(err: HttpErrorResponse) => {
      const errorResponseStatus: number = err.status;

      if(errorResponseStatus == 404) {
        this.invalidLoginMessageSet('Usuario y/o contraseña incorrectos')
      }
      else {
        this.invalidLoginMessageSet(TRY_AGAIN_MESSAGE);
      }

    });
  }

  invalidLoginMessageSet(messsage: string) {
    this.invalidLogin=true;
    this.loadingLogin=false;
    this.setErrorMessage(messsage)
  }

  subscribeAuthService()
  {
    this.authenticationProcess=this.socialAuthService.authState.subscribe((user) =>
    {
      if(user) {
        this.isExternalLogin = true;
        this.socialUser = user;
        console.log(this.socialUser);

        this.newExternalUser=new NewUser(user.firstName, user.lastName, '', user.email, null, true, 2);

        this.authService.externalAuthenticating(new LoginUser(this.newExternalUser.mail, this.newExternalUser.password)).subscribe(res =>
        {
          console.log(res);

          if(res.jwt)
          {
            this.loadNeededInformation(res);
          }

          if(!res.mail)
          {
            this.createRegistrationForm();
          }

        }, err =>
        {
          console.log(err);
        });
      }

    }, err =>
    {
      console.log(err);
    });

  }

  createRegistrationForm()
  {
    //this.scrollToElement();
    this.completeRegistrationForm=this.fb.group(
    {
      identifier: new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]),
    });
    this.showRegistrationForm=true;

    setTimeout(this.scrollToElement, 1000);
  }

  onFinishedLogin()
  {
    this.newExternalUser.matricula=this.completeRegistrationForm.get('identifier').value;
    this.newExternalUser.externo=true;
    this.userService.registerExternalUser(this.newExternalUser).subscribe(res =>
    {
      this.authService.externalAuthenticating(new LoginUser(this.newExternalUser.mail, null)).subscribe(userInfo =>
      {
        this.loadNeededInformation(userInfo);
      },
      () =>{
        this.setErrorMessage(TRY_AGAIN_MESSAGE)
      });
    }, (err: HttpErrorResponse) => {
      const errMessage : string = err.error.message;

      if(errMessage.includes('Duplicate')) {
        this.setErrorMessage('El mail que se está utilizando ya existe en el sistema')
      }
      else {
        this.setErrorMessage(TRY_AGAIN_MESSAGE);
      }
    });
  }

  loadNeededInformation(user)
  {
    localStorage.setItem('currentUser', user.mail);
    localStorage.setItem('userId', user.id_usuario.toString());
    localStorage.setItem('token', user.jwt)
    this.invalidLogin=false;
    this.permissionService.getUserPermissions(user.id_usuario.toString());
    this.router.navigate(['home']);
  }

  onGoogleLogin()
  {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  onFacebookLogin()
  {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  scrollToElement() {
    document.getElementById('neededData').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  ngOnDestroy(): void {
    this.authenticationProcess.unsubscribe();
    this.isExternalLogin ? this.socialAuthService.signOut(true) : null;
  }

  getLoadingLogin() {
    return this.loadingLogin;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
    this.showErrorMessage = true;
  }
}
