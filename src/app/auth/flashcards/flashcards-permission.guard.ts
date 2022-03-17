import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { FlashcardService } from './../../services/flashcard.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashcardsPermissionGuard implements CanActivate {

  constructor(private router: Router, private flashcardService: FlashcardService, private userService: UserService,
  private permissionService: PermissionService){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>
  {
    let res: boolean=false, teacherCond: boolean=false, rescount, canEdit: boolean;
    //rescount=await this.userService.canDoTeacherTask(+localStorage.getItem('userId'));
    teacherCond=await this.permissionService.canEdit('flashcard');

    //teacherCond=(rescount.cantidad_materias>0);
    teacherCond=!!teacherCond;

    //this.flashcardService.canEditFlashcard(+route.paramMap.get('id_flashcard'))

    if(teacherCond)
    {
      canEdit=(await this.flashcardService.canEditFlashcard(+route.paramMap.get('id_flashcard'), +localStorage.getItem('userId')))>0;
    }/*
    this.userService.canDoTeacherTask(+localStorage.getItem('userId')).subscribe((isTeacher: isTeacherCond) =>
    {
      teacherCond=(isTeacher.cantidad_materias>0);
      teacherCond && this.flashcardService.canEditFlashcard(+route.paramMap.get('id_flashcard'), +localStorage.getItem('userId')).subscribe(edit =>
      {
        res=isTeacher && edit;
      });

    });*/

    res=teacherCond&&canEdit

    if(!res) this.router.navigate(['flashcards', 'list'])

    return res;
  }

}

interface isTeacherCond
{
  cantidad_materias: number;
}
