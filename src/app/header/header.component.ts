import { PermissionService } from './../services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit } from '@angular/core';
import { SubjectClass } from '../shared/Subject';
import { faCaretDown, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { fadeInHorizontal } from './../animations/FadeInHorizontalDelayed';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [ fadeInHorizontal ]
})
export class HeaderComponent implements OnInit
{
  caretDown=faCaretDown;
  graduatedIcon=faUserGraduate;
  subjects: Array<SubjectClass>=new Array<SubjectClass>();
  showRight: boolean;
  show:boolean;
  canView: boolean=false;

  constructor(private subjectService:SubjectService, private permissionService: PermissionService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.getSubjects();
      this.show=false;
      this.showRight=false;
      this.getPermissionForAdmin();
    });
  }

  showDropdown()
  {
    //this.isShow=!this.isShow;
    //console.log(this.isShow);
  }

  getSubjects()
  {
    this.subjectService.getSubjectsForStudent(localStorage.getItem('userId'), 0, 4).subscribe(subjects =>
    {
      this.subjects=subjects;
    })
  }

  isAuthenticated()
  {
    return (localStorage.getItem('currentUser')!==null)
  }

  logOut()
  {
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.canView=false;
  }

  onShow()
  {
    this.show=!this.show;
  }

  onShowRight()
  {
    this.showRight=!this.showRight;
  }

  getPermissionForAdmin()
  {/*
    this.permissionService.canView('usuario').then(res =>
    {
      this.canView=!!res;
    });*/

    this.permissionService.canView('usuario').then(res =>
    {
      this.canView=!!res;
    });
  }
}
