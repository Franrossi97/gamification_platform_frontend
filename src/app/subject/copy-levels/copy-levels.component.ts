import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from './../../services/subject.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SubjectClass } from 'src/app/shared/Subject';

@Component({
  selector: 'app-copy-levels',
  templateUrl: './copy-levels.component.html',
  styleUrls: ['./copy-levels.component.scss']
})
export class CopyLevelsComponent implements OnInit {

  xIcon=faTimes;
  years: Array<number>;
  subjectFilterForm: FormGroup;
  private ID_SUBJECT: number;
  private subject: SubjectClass;
  relatedSubjects: Array<SubjectClass>;
  showErrorGetScreen: boolean=true;
  showErrorCopyScreen: boolean=false;


  constructor(private route: ActivatedRoute, private subjectService: SubjectService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(params =>
    {
      this.ID_SUBJECT=+params.get('id_subject');

      this.getSubjectInformation();

      this.createFilterForm();

      this.years=new Array<number>();
      this.generateArrayofYears();
    });
  }

  getSubjectInformation()
  {
    this.subjectService.getOneSubject(this.ID_SUBJECT).subscribe(subject =>
    {
      this.subject=subject;

      console.log(subject);

      this.getRelatedSubjects(subject.nombre, -1, -1);
    });
/*
    this.subjectService.sendData().subscribe(subject =>
    {
      this.subject=subject;

      console.log(subject);

      this.getRelatedSubjects(subject.nombre, null, null);
    });*/
  }

  getRelatedSubjects(search: string, quarter: number, year: number)
  {
    this.subjectService.getSubjectBySearchWithOutLimit(search, quarter, year).subscribe(res =>
    {
      this.relatedSubjects=res;
      console.log(this.relatedSubjects);
      this.showErrorGetScreen=false;
    }, err =>
    {
      this.showErrorGetScreen=true;
    });
  }

  createFilterForm()
  {
    this.subjectFilterForm=this.fb.group(
    {
      quarter: new FormControl(-1),
      year: new FormControl(-1),
    });

    this.onChangeFilters();
  }

  generateArrayofYears()
  {
    let actualTime: Date=new Date();
    let actualYear: number=actualTime.getFullYear();
    let beginningYear: number=actualYear-6;

    for(; beginningYear<=actualYear; beginningYear++)
    {
      this.years.push(beginningYear);
    }
  }

  onChangeFilters()
  {
    this.subjectFilterForm.valueChanges.subscribe(changes =>
    {
      this.getRelatedSubjects(this.subject.nombre, changes.quarter, changes.year);
    });
  }

  onCopyLevels(idSubjectCopy: number)
  {
    this.subjectService.copyLevels(this.ID_SUBJECT, idSubjectCopy).subscribe(res =>
    {
      this.router.navigate(['subject', this.ID_SUBJECT]);
    }, err =>
    {
      //error
      this.showErrorCopyScreen=true;
    });
  }

  public getIdSubject(){
    return this.ID_SUBJECT;
  }

  public setIdSubject(idSubject: number){
    this.ID_SUBJECT=idSubject;
  }

  public getSubject(){
    return this.subject;
  }

  public setSubject(subject: SubjectClass){
    this.subject= subject;
  }

}
