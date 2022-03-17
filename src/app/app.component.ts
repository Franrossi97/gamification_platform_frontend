import { PermissionService } from './services/permission.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webapp-gamificacion-frontend';

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
  ) { }

  ngOnInit()
  {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
