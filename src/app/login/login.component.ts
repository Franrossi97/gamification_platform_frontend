import { AuthService } from './../auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {LoginUser} from '../shared/LoginUser';
import {Router} from '@angular/router'
import { User } from '../shared/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit
{
  invalidLogin: boolean=false;
  loginUserForm: FormGroup;
  @ViewChild('fform') newSubjectFormDirective;
  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router) { }

  ngOnInit(): void
  {
    this.createForm();
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
    let loginUser: LoginUser=new LoginUser();
    loginUser.mail=this.loginUserForm.get('mail').value; loginUser.password=this.loginUserForm.get('password').value;
    console.log(loginUser.mail);
    this.authService.authenticating(loginUser).subscribe((response) =>
    {
      console.log(response);
      let user: User=response[0];
      console.log(user);
      localStorage.setItem('currentUser', user.mail);
      localStorage.setItem('userId', user.id_usuario.toString());
      this.invalidLogin=false;
      this.router.navigate(['home']);
    },(err) => {console.log(err);this.invalidLogin=true;});
  }
}
