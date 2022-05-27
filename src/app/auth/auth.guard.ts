import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  {
    let res: boolean=true, promiseRes: string, promiseStructure;
    /*
    this.authService.isAuthenticated().subscribe(res =>
    {
      console.log('Token valid');

      res=true;
    }, err =>
    {
      console.log(err);
      res=false;
    });*/

    let jwtToken: string;
    //console.log(route.url);
    if(route.url[0].path=="activation")
    {
      jwtToken=route.paramMap.get('jwt');
      //jwtToken=localStorage.getItem('token');
    }
    else
    {
      jwtToken=localStorage.getItem('token');
    }

    try
    {
      promiseStructure=await this.authService.isAuthenticated(jwtToken);
      //console.log(promiseStructure);
    }
    catch(err)
    {
      console.log(err);
    }

    if(promiseStructure)
    {
      if(promiseStructure.message=='Auth success')
      {
        res=true;
      }
      else
      {
        //this.router.navigate(['login']);
        this.notAuthenticated();
      }
    }
    else
    {
      //this.router.navigate(['login']);
      this.notAuthenticated();
    }

    return res;

  }

  notAuthenticated()
  {
    this.router.navigate(['login']);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
  }

}
