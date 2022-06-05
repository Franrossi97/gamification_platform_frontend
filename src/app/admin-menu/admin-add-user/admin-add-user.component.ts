import { PermissionService } from './../../services/permission.service';
import { NewUser } from './../../shared/NewUser';
import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/shared/Permission';

@Component({
  selector: 'app-admin-add-user',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.scss']
})
export class AdminAddUserComponent implements OnInit {

  permissionsName: Array<Permission>;
  newUser: NewUser;
  newUserForm: FormGroup;
  error: boolean=false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
  private userService: UserService, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.createNewUserForm();
      this.getPermissionsName();
    });
  }

  createNewUserForm()
  {
    this.newUserForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
      lastname: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      enrollment: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(8), Validators.min(0)]),
      profile: new FormControl(null, Validators.required),
      password: new FormControl('Gamificacion2022', [Validators.required, Validators.minLength(5)]),
    });
  }

  onSubmitUserInformation()
  {
    this.newUser=new NewUser(this.newUserForm.get('name').value, this.newUserForm.get('lastname').value,
    this.newUserForm.get('enrollment').value, this.newUserForm.get('email').value, this.newUserForm.get('password').value, false, this.newUserForm.get('profile'));

    this.userService.registerUser(this.newUser).subscribe(res =>
    {
      this.error=false;
      this.createNewUserForm();
    }, err =>
    {
      this.error=true;
    });
  }

  getPermissionsName()
  {
    this.permissionService.getPermissions().subscribe(res =>
    {
      this.permissionsName=res; //Profesor, Estudiante, Administrador
    });
  }
}
