import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectViewGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router, private permissionService: PermissionService){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      let idSubject= route.paramMap.get('id');
      let idUser= localStorage.getItem('userId');
      let serviceRes, permissionRes;

      /*if(!idSubject) {
        idSubject= this.getSubjectId(route.url);
      }*/

      serviceRes=await this.userService.canViewSubject(idUser, idSubject);
      permissionRes=!!(await this.permissionService.canView('materia'));

      if(!(serviceRes && permissionRes)) {
        this.redirectPage();
      }

      return serviceRes && permissionRes;
  }

  /*getSubjectId(urlSearch: Array<UrlSegment>) {
    let idRes=-1;
    for(let i=0; i< urlSearch.length && idRes==-1; i++) {
      if(urlSearch[i].path == 'subject'){
        idRes= Number(urlSearch[i+1].path);
      }
    }

    return String(idRes);
  }*/

  redirectPage() {
    this.router.navigate(['subjects']);
  }
}
