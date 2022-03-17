import { PermissionService } from './../../services/permission.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate
{

  constructor(private permissionService: PermissionService, private router: Router){}

  async canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Promise<boolean | UrlTree>
  {
    let res: boolean=(await this.permissionService.canView('usuario'));

    if(!res)
    {
      this.router.navigate(['home']);
      console.log('false');
    }

    return !!res;
  }

}
