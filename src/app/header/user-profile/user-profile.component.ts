import { passwordMatching } from './../../shared/validators/equal-validator';
import { UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { User } from './../../shared/User';
import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { containsMayus, containsNumber, containsSpecialCharacter } from 'src/app/shared/validators/strengths-validators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User;
  editing = false;
  editingPassword = false;
  userInfoForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  newInfoUser: User;
  errors: Array<string>= new Array<string>();
  showChangePasswordMessage: boolean;
  changePasswordMessage: string;

  constructor(private route: ActivatedRoute, private userService: UserService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.getUserInfo(+localStorage.getItem('userId'));
    });
  }

  getUserInfo(userId: number)
  {
    this.userService.searchUser(userId).subscribe((user: Array<User>) =>
    {
      this.user=user[0];
      console.log(this.user);

    });
  }

  onEditInfo()
  {
    this.editing=true;
    this.userInfoForm=this.fb.group(
    {
      nombre: new UntypedFormControl(this.user.nombre, [Validators.required]),
      apellido: new UntypedFormControl(this.user.apellido, [Validators.required]),
      mail: new UntypedFormControl(this.user.mail, [Validators.required]),
      matricula: new UntypedFormControl(this.user.matricula, [Validators.required]),
    });
  }

  onSaveInfo()
  {
    this.errors.length=0;
    this.newInfoUser=new User(undefined,
      this.userInfoForm.get('nombre').value != this.user.nombre ? this.userInfoForm.get('nombre').value : undefined,
    this.userInfoForm.get('apellido').value != this.user.apellido ? this.userInfoForm.get('apellido').value : undefined,
    this.userInfoForm.get('matricula').value != this.user.matricula ? this.userInfoForm.get('matricula').value : undefined,
    this.userInfoForm.get('mail').value != this.user.mail ? this.userInfoForm.get('mail').value : undefined, undefined, undefined);
    //this.checkNewValues(this.newInfoUser);
    this.userService.editUser(+localStorage.getItem('userId'), this.newInfoUser).subscribe(() =>
    {
      this.user.nombre = this.userInfoForm.get('nombre').value;
      this.user.apellido = this.userInfoForm.get('apellido').value;
      this.user.matricula = this.userInfoForm.get('matricula').value;
      this.user.mail = this.userInfoForm.get('mail').value;

      this.editing = false;
    }, (err: HttpErrorResponse) =>{
      console.log(err.error.message);

      this.generateErrorMessage(err.error.message)
    });
  }

  generateErrorMessage(message: string) {
    if(message.includes('mail')) {
      this.errors.push('El mail se encuentra duplicado.')
    }
    if(message.includes('nombre')) {
      this.errors.push('El nombre excede el límite de caracteres (25).')
    }
    if(message.includes('apellido')) {
      this.errors.push('El apellido excede el límite de caracteres (25).')
    }
    if(message.includes('matricula')) {
      this.errors.push('La matrícula excede el límite de caracteres (8).')
    }
  }

  checkNewValues(infoUser: User): User
  {
    if(infoUser.nombre==this.user.nombre)
    {
      this.newInfoUser.nombre=undefined;
    }
    if(infoUser.apellido==this.user.apellido)
    {
      this.newInfoUser.apellido=undefined;
    }
    if(infoUser.mail==this.user.mail)
    {
      this.newInfoUser.mail=undefined;
    }
    if(infoUser.matricula==this.user.matricula)
    {
      this.newInfoUser.matricula=undefined;
    }

    return this.newInfoUser;
  }

  onCancel()
  {
    this.userInfoForm=null;
    this.editing=false;
  }

  onCancelPassword()
  {
    this.passwordForm=null;
    this.editingPassword=false;
  }

  onEditPassword()
  {
    this.editingPassword=true;
    this.passwordForm=this.fb.group(
    {
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
      newpassword: new UntypedFormControl(null, [Validators.required, Validators.minLength(6), containsSpecialCharacter(), containsNumber(), containsMayus()]),
      repeatnewpassword: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
    },
    {
      validators: passwordMatching,
    });
  }

  changePassword()
  {
    this.showChangePasswordMessage=true;

    this.userService.changePassword(+localStorage.getItem('userId'), this.passwordForm.get('password').value,
    this.passwordForm.get('newpassword').value).subscribe(res =>
    {
      this.changePasswordMessage='Se cambio con éxito su contraseña.';
    }, err => {
      this.changePasswordMessage='Ocurrió un error al intentar cambiar su contraseña';
    });
  }

}
