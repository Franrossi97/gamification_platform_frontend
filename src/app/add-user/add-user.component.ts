import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { User } from '../shared/User';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit
{
  magnifying=faSearch;
  searchUserForm:FormGroup;
  message:string;
  successful:boolean;
  @Input() userType:number;

  @ViewChild('fform') searchUserFormDirective;
  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute,
  private router: Router) { }

  ngOnInit(): void
  {
    this.message=null;
    this.successful=false;
    this.createLevelForm();
  }

  createLevelForm()
  {
    this.searchUserForm=this.fb.group(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSubmitUser() //Primero busco el usuario y si lo encuentro lo registro en la tabla de cursa, si no se notifica.
  {
    const userEmail:string=this.searchUserForm.get('email').value;
    this.userService.searchUser(userEmail).subscribe((user: User) =>
    {
      console.log(user);
      this.message=`El usuario con correo electrónico ${userEmail} se encuentra registrado. Agregando el usuario...`;
      this.searchUserForm.reset();
      console.log(user[0].id_usuario);

      this.userService.linkUsertoSubject(this.userType, user[0].id_usuario, this.route.snapshot.params.id).subscribe(res =>
      {
        console.log(res);
        this.successful=true;
        //Redireccionar a la lista de estudiantes?
      });
    }
    ,err =>
    {
      console.log(err);
      this.message=`El usuario con correo electrónico ${userEmail} no se encuentra registrado o está mal escrito.`;
    });
  }

}
