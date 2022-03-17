import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { LevelService } from './../../services/level.service';
import { SubjectService } from './../../services/subject.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router, private permissionService: PermissionService){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>
  {
    let res: boolean=false, userType: number;
    res=await this.permissionService.canEdit('materia');
    //userType=await this.userService.numberUserType(localStorage.getItem('userId'), route.paramMap.get('id_subject'));
    /*this.userService.numberUserType(localStorage.getItem('userId'), route.paramMap.get('id_subject')).subscribe(userType =>
    {
      console.log(userType);

      res=userType==1;

      this.router.navigate(['subject', route.paramMap.get('id_subject')]);
    });*/

    return !!res;
  }

}
