import { PermissionService } from './../../services/permission.service';
import { faEdit, faTrash, faMinusCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../shared/User';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: Array<User>=new Array<User>();
  editIcon=faEdit;
  deleteIcon=faTrash;
  inactivateIcon=faMinusCircle;
  activateIcon=faPlus;
  canEdit = false;
  error = false;
  errorMessage: string;/*
  changeLayoutEmitter=new EventEmitter();
  idEditting: boolean=false;*/

  constructor(private route: ActivatedRoute, private userService: UserService, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(() =>
    {
      this.userService.getAllUsers().subscribe((users: Array<User>) =>
      {
        this.users=users;
      });

      this.getUserPermission();
    });
  }

  inactivateUser(userId: number, userIndex: number)
  {
    this.userService.inactivateUser(userId).subscribe(() =>
    {
      this.error=false;
      this.users[userIndex].validado=false;
    });
  }

  activateUser(userId: number, userIndex: number)
  {
    this.userService.activateUser(userId).subscribe(() =>
    {
      this.error=false;
      this.users[userIndex].validado=true;
    });
  }

  async getUserPermission()
  {
    this.canEdit=await this.permissionService.canEdit('usuario');
  }

  deleteUser(userId: number, userIndex: number)
  {
    this.userService.removeUser(userId).subscribe(() =>
    {
      this.error=false;
      this.users.splice(userIndex, 1);
    });
  }

}
