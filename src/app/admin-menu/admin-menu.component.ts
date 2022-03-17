//import { EditUserComponent } from './edit-user/edit-user.component';
import { PermissionService } from './../services/permission.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  canEdit: boolean=false;
  showEdit: boolean=false;
  constructor(private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(res =>
    {
      console.log(res);

      this.getUserPermissions();
    });
  }


  async getUserPermissions()
  {
    this.canEdit=await this.permissionService.canEdit('usuario');
  }

  changeViewReceiver(componentRef)
  {
    //const child: EditUserComponent=componentRef;

    this.showEdit=componentRef.idEditting;
  }
}
