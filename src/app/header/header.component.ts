import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit } from '@angular/core';
import { SubjectClass } from '../shared/Subject';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  caretDown=faCaretDown;
  subjects: SubjectClass[];
  showRight: boolean;
  show:boolean;
  constructor(private subjectService:SubjectService, private route:ActivatedRoute) { }

  ngOnInit(): void
  {
    this.getSubjects();
    //this.isShow=false;
    this.show=false;
    this.showRight=false;
  }

  showDropdown()
  {
    //this.isShow=!this.isShow;
    //console.log(this.isShow);
  }

  getSubjects()
  {
    this.subjectService.getSubjectsForStudent(localStorage.getItem('userId')).subscribe(subjects =>
    {
      console.log('tomo datos');
      this.subjects=subjects;
      if(this.subjects.length>4)
        this.subjects.length=4
    })
  }

  isAuthenticated()
  {
    return (localStorage.getItem('currentUser')!==null)
  }

  logOut()
  {
    localStorage.removeItem('currentUser')
  }

  onShow()
  {
    this.show=!this.show;
  }

  onShowRight()
  {
    this.showRight=!this.showRight;
  }
}
