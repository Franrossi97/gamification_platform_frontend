import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { FlashcardService } from './../../services/flashcard.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CreateFlashcardGuard implements CanActivate {

  constructor(private router: Router, private flashcardService: FlashcardService, private userService: UserService,
  private permissionService: PermissionService){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>
  {

    let res: boolean=false, rescount;
    //rescount=await this.userService.canDoTeacherTask(+localStorage.getItem('userId'))

    //res=(rescount.cantidad_materias>0);
    res=await this.permissionService.canEdit('flashcard');

    //teacherCond=(rescount.cantidad_materias>0);
    res=!!res;

    if(!res) this.router.navigate(['flashcards', 'list'])

    return res;
  }

}
