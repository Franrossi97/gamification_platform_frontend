import { UserService } from './../services/user.service';
import { SubjectService } from './../services/subject.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectClass } from '../shared/Subject';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subjectsTeacher: SubjectClass[]=new Array();
  subjectsStudent: SubjectClass[]=new Array();
  searchResultSubject: Array<SubjectClass>;

  magnifying=faSearch;
  constructor(private router: Router, private subjectService:SubjectService) { }

  ngOnInit(): void
  {
    this.getSubjects();
  }

  onNewSubject()
  {
    this.router.navigate(['create-subject'])
  }

  getSubjects()
  {
    this.subjectService.getSubjectsForTeacher(localStorage.getItem('userId')).subscribe(subjects =>
    {
      //console.log(subjects);
      this.subjectsTeacher=subjects;
    },(err) => console.log(err));

    this.subjectService.getSubjectsForStudent(localStorage.getItem('userId')).subscribe(subjects =>
    {
      //console.log(subjects);
      this.subjectsStudent=subjects;
    },(err) => console.log(err));
  }

  sendRequestData(requestedSubject: SubjectClass)
  {
    //console.log(requestedSubject);

    this.subjectService.sendData(requestedSubject);

    this.router.navigate(['subject', requestedSubject.id_materia]);
  }

  disableSubject(idSubject: number)
  {
    this.subjectService.hideSubject(idSubject).subscribe(res =>
    {
      this.subjectsTeacher[this.getTeacherSubjectIndexById(idSubject)].show_menu=false;
    }, err =>
    {
      console.log(err);
    });
  }

  enableSubject(idSubject: number)
  {
    this.subjectService.showSubject(idSubject).subscribe(res =>
    {
      this.subjectsTeacher[this.getTeacherSubjectIndexById(idSubject)].show_menu=true;
    }, err =>
    {
      console.log(err);
    });
  }

  getTeacherSubjectIndexById(idSubject: number): number
  {
    let res: number=-1;

    for(let i=0; i<this.subjectsTeacher.length && res==-1; i++)
    {
      if(this.subjectsTeacher[i].id_materia==idSubject)
      {
        res=i;
      }
    }
    //console.log(res);
    return res;
  }

}
