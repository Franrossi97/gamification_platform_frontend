import { PermissionService } from './../services/permission.service';
import { NewUser } from './../shared/NewUser';
import { UserService } from './../services/user.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from './../auth/auth.service';
import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {LoginUser} from '../shared/LoginUser';
import {Router} from '@angular/router'
import { providerId } from '../shared/GoogleProviderId';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy
{
  invalidLogin: boolean=false;
  loginUserForm: FormGroup;
  completeRegistrationForm: FormGroup;
  showRegistrationForm: boolean=false;
  socialUser: SocialUser;
  newExternalUser: NewUser;
  private loadingLogin: boolean=false;
  private authenticationProcess: Subscription;
  private elementToScroll;

  @ViewChild('fform') newSubjectFormDirective;
  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router,
  private socialAuthService: SocialAuthService, private userService: UserService, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.createForm();

    this.subscribeAuthService();
    if(localStorage.getItem('currentUser')!==null)
      this.router.navigate(['home']);
  }

  createForm()
  {
    this.loginUserForm=this.fb.group(
    {
      mail: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40)]),
      password: new FormControl(null, [Validators.required,Validators.minLength(5),Validators.maxLength(35)]),
    })
  }

  onSubmit()
  {
    this.loadingLogin=true;
    let loginUser: LoginUser=new LoginUser(this.loginUserForm.get('mail').value, this.loginUserForm.get('password').value);
    this.authService.authenticating(loginUser).subscribe(res =>
    {
      if(res.length==0)
      {
        this.invalidLogin=true;
      }

      if(res.jwt)
      {
        this.loadNeededInformation(res);
      }

      this.loadingLogin=false;
    },(err) => {this.invalidLogin=true; this.loadingLogin=false;});
  }

  subscribeAuthService()
  {
    this.authenticationProcess=this.socialAuthService.authState.subscribe((user) =>
    {
      this.socialUser = user;
      //this.isLoggedin = (user != null);
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

    }, err =>
    {
      console.log(err);
    });

  }

  createRegistrationForm()
  {
    this.scrollToElement();
    this.completeRegistrationForm=this.fb.group(
    {
      identifier: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]),
    });
    this.showRegistrationForm=true;
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
      err =>{
        console.log('Error al loguearse');
      });
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

  onGoogleLogin($element)
  {
    this.elementToScroll= $element;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  onFacebookLogin($element)
  {
    this.elementToScroll= $element;
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  scrollToElement() {
    this.elementToScroll.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  ngOnDestroy(): void {

    this.authenticationProcess.unsubscribe();
  }

  getLoadingLogin() {
    return this.loadingLogin;
  }
}
