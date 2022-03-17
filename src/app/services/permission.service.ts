import { HttpClient } from '@angular/common/http';
//import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseUrl';
import { Permission } from '../shared/Permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService
{
  permissions: Map<string, Map<string, boolean>>;
  constructor(private userService: UserService, private http: HttpClient) { }

  async getUserPermissions(userId: number)
  {
    this.permissions=await this.generateUserPermissionMap(await this.userService.getUserPermissions(userId).toPromise());
    console.log(this.permissions);

    return this.permissions;
    await this.userService.getUserPermissions(userId).subscribe(async (res: Array<any>) =>
    {
      this.permissions=await this.generateUserPermissionMap(res);

      console.log(this.permissions);
    });
  }

  async generateUserPermissionMap(permissions: Array<Permissions>)
  {
    let res: Map<string, Map<string, boolean>>=new Map<string, Map<string, boolean>>(), splitDescription: Array<string>;

    permissions.forEach(permission =>
    {
      let permissionsValues: Map<string, boolean>=new Map<string, boolean>();
      splitDescription=permission.descripcion.split('_');
      permissionsValues.set('lectura', permission.lectura);
      permissionsValues.set('escritura', permission.escritura);
      res.set(splitDescription[0], permissionsValues);
    });

    return res;
  }
/*
  getUserPermissionsObs(): BehaviorSubject<Map<string, Map<string, boolean>>>
  {
    return new BehaviorSubject(this.permissions);
  }*/

  async canView(what: string): Promise<boolean>
  {
    let res;
    if(this.permissions==undefined)
    {
      await this.getUserPermissions(+localStorage.getItem('userId')).then(nothing =>
      {
        res=this.permissions.has(what) && this.permissions.get(what).get('lectura');
      });
    }
    else
    {
      res=this.permissions.get(what).get('lectura');
    }

    return res;
  }

  async canEdit(what: string): Promise<boolean>
  {
    let res;
    if(this.permissions==undefined)
    {
      await this.getUserPermissions(+localStorage.getItem('userId')).then(nothing =>
      {
        res=this.permissions.has(what) && this.permissions.get(what).get('escritura');
      });
    }
    else
    {
      res=this.permissions.get(what).get('escritura');
    }

    return res;
  }

  async adminPermissions()
  {
    if(this.permissions==undefined)
    {
      await this.getUserPermissions(+localStorage.getItem('userId'));
    }

    return this.checkAdmin(this.permissions.values());
  }

  async checkAdmin(desorganizePermissions: IterableIterator<Map<string, boolean>>)
  {
    let res=true, iteratorValue: Map<string, boolean>;

    iteratorValue=desorganizePermissions.next().value;
    while(res && desorganizePermissions.next)
    {
      if(!(iteratorValue.get('lectura') && iteratorValue.get('escritura')))
      {
        res=false;
      }
    }

    return res;
  }

  getPermissions()
  {
    const getUrl: string=`${baseURL}/permissions`;

    return this.http.get<Array<Permission>>(getUrl);
  }

}

interface Permissions
{
  descripcion: string,
  lectura: boolean,
  escritura: boolean,
}
