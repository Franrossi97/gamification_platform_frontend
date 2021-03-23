import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SubjectService} from '../services/subject.service';
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
      console.log(subjects);
      this.subjectsTeacher=subjects;
    },(err) => console.log(err));

    this.subjectService.getSubjectsForStudent(localStorage.getItem('userId')).subscribe(subjects =>
      {
        console.log(subjects);
        this.subjectsStudent=subjects;
      },(err) => console.log(err));
  }

  getSubjectById(id:number): Promise<SubjectClass>
  {
    let i=0;
    let subject=null;
    let allSubjects: SubjectClass[]=this.subjectsStudent.concat(this.subjectsTeacher);
    while(allSubjects.length>i && allSubjects[i].id_materia!==id)
    {
      i++;
    }
    if(allSubjects.length>i)
      subject=allSubjects[i];
    /*const subject=this.subjects.find(subject =>
    {
      subject.id_materia==id;
    })*/
    console.log(subject);

    this.subjectService

    if(subject!=null)
      return new Promise(resolve =>
      {
        resolve(subject);
      });
  }

  sendRequestData(requestedSubject: SubjectClass)
  {
    console.log(requestedSubject);
    this.getSubjectById(requestedSubject.id_materia).then(resSubject =>
    {
      this.subjectService.sendRequestData(resSubject);
    });
  }

}
