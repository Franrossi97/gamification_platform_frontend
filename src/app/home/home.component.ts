import { PermissionService } from './../services/permission.service';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubjectClass } from '../shared/Subject';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private canEdit: boolean=false;
  private arrowDown=faCaretDown;
  private showDropDown: boolean=true;

  constructor(private permissionService: PermissionService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.canEditSubject();
    //this.router.navigate(['cursando'], {relativeTo: this.route});
  }

  getIconArrowDown(){
    return this.arrowDown;
  }

  getShowDropDown(){
    return this.showDropDown;
  }

  setShowDropDown(value: boolean){
    this.showDropDown=value;
  }

  getCanEdit(){
    return this.canEdit;
  }

  canEditSubject(){
    this.permissionService.canEdit('materia').then(can =>
    {
      this.canEdit= can;
    });
  }

  onChangeView(){
    this.showDropDown= !this.showDropDown;
  }
}
