import { UserService } from './../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NewUser } from '../shared/NewUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit
{
  newUserError: boolean=false;
  newUserForm: FormGroup;
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
      mail: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40)]),
      password: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(35)]),
      enrollment: new FormControl(null, [Validators.required,Validators.minLength(5),Validators.maxLength(6)]),
    })
  }

  onSubmit()
  {
    let newUser=new NewUser (this.newUserForm.get('name').value, this.newUserForm.get('lastname').value,
    this.newUserForm.get('enrollment').value, this.newUserForm.get('mail').value,
    this.newUserForm.get('password').value, false, 2);

    //console.log(newUser.nombre);console.log(newUser.apellido);console.log(newUser.matricula);console.log(newUser.mail);
    this.userService.registerUser(newUser).subscribe(data =>
    {
      //console.log(data);
      //console.log('User succesfully added');
      this.router.navigate(['login']);
    },
    error =>
    {
      console.log(error);
      this.newUserError=true;
    });
  }
}
