import { PermissionService } from './../../services/permission.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { User } from './../../shared/User';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Permission } from 'src/app/shared/Permission';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  permissionsName: Array<Permission>;
  user: User=null;
  editUserForm: FormGroup=null;
  error: boolean=false;

  idEditting: boolean=true;
  changeLayoutEmitter=new EventEmitter();

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.getPermissionsName();

      this.getUserInformation(+param.get('id_usuario')).then(res =>
      {
        this.user=res[0];

        this.createEditUserForm();
      });

      this.changeLayoutEmitter.emit();
    });

  }

  createEditUserForm()
  {
    this.editUserForm=this.fb.group(
    {
      name: new FormControl(this.user.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
      lastname: new FormControl(this.user.apellido, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
      email: new FormControl(this.user.mail, [Validators.required, Validators.email]),
      enrollment: new FormControl(this.user.matricula, [Validators.required, Validators.minLength(5), Validators.maxLength(8), Validators.min(0)]),
      profile: new FormControl(this.user.perfil, Validators.required),
    });
  }

  onSubmitUserInformation()
  {
    this.user=new User(null, this.editUserForm.get('name').value, this.editUserForm.get('lastname').value,
    this.editUserForm.get('enrollment').value, this.editUserForm.get('email').value, null, +this.editUserForm.get('profile'));

    this.userService.editUser(this.user.id_usuario, this.user).subscribe(res =>
    {
      this.error=false;
      this.createEditUserForm();
    }, err =>
    {
      this.error=true;
    });
  }

  getUserInformation(idUser: number)
  {
    return this.userService.searchUser(idUser).toPromise();
  }

  getPermissionsName()
  {
    this.permissionService.getPermissions().subscribe(res =>
    {
      this.permissionsName=res;
    });
  }

}
