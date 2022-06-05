import { UserService } from './../../services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectViewGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      let idSubject= route.paramMap.get('id');
      let idUser= localStorage.getItem('userId');
      let serviceRes;

      /*if(!idSubject) {
        idSubject= this.getSubjectId(route.url);
      }*/

      serviceRes=await this.userService.canViewSubject(idUser, idSubject);

      if(!serviceRes) {
        this.redirectPage();
      }

      return serviceRes;
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
