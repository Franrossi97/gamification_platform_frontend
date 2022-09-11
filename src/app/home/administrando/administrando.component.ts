import { fadeIn } from './../../animations/FadeIn';
import { Router } from '@angular/router';
import { SubjectClass } from './../../shared/Subject';
import { SubjectService } from './../../services/subject.service';
import { Component, OnInit } from '@angular/core';
import { generateArrayOfSubjectsId, generateMapOfImageOfSubjectsId } from '../Utils/utilPictures';

@Component({
  selector: 'app-administrando',
  templateUrl: './administrando.component.html',
  styleUrls: ['./administrando.component.scss'],
  animations: [
    fadeIn
  ]
})
export class AdministrandoComponent implements OnInit {

  private USER_ID =0;
  private subjects: Array<SubjectClass>=new Array<SubjectClass>();
  private imagesOfSubjectId: Map<number, any>= new Map<number, any>();

  private actualPage =0;
  private totalPages =0;
  private pages: Array<number>=new Array<number>();

  constructor(private subjectService: SubjectService, private router: Router) { }

  ngOnInit(): void
  {
    this.USER_ID=+localStorage.getItem('userId');
    this.getSubjectsDB();
  }

  getSubjectsDB(){

    this.subjectService.getSubjectPagination(this.USER_ID, 0).subscribe(res =>
    {
      this.totalPages= Math.ceil(res.total/res.per_page);

      this.generateArrayOfPages(this.totalPages);

      this.onGetSubjectPage(0, res.per_page);
    });

  }

  onGetSubjectPage(page: number, cantPerPage: number){

    this.actualPage= page;
    this.subjectService.getSubjectsForTeacher(this.USER_ID, (page)*(cantPerPage-1), cantPerPage).subscribe(async subjects =>
    {
      this.subjects=subjects;

      let subjectsId= await generateArrayOfSubjectsId(this.subjects);

      this.subjectService.getCoverImages(subjectsId).subscribe(res =>
      {
        this.imagesOfSubjectId= generateMapOfImageOfSubjectsId(res);

        this.setCoverImages();
      });
    },(err) => console.log(err));
  }

  getSubjects(){
    return this.subjects;
  }

  getActualPage(){
    return this.actualPage;
  }

  onNewSubject()
  {
    this.router.navigate(['create-subject']);
  }

  sendRequestData(requestedSubject: SubjectClass)
  {
    this.subjectService.sendData(requestedSubject);

    this.router.navigate(['subject', requestedSubject.id_materia]);
  }

  disableSubject(idSubject: number)
  {
    this.subjectService.hideSubject(idSubject).subscribe(res =>
    {
      this.subjects[this.getTeacherSubjectIndexById(idSubject)].show_menu=false;
    }, err =>
    {
      console.log(err);
    });
  }

  enableSubject(idSubject: number)
  {
    this.subjectService.showSubject(idSubject).subscribe(res =>
    {
      this.subjects[this.getTeacherSubjectIndexById(idSubject)].show_menu=true;
    }, err =>
    {
      console.log(err);
    });
  }

  getTeacherSubjectIndexById(idSubject: number): number
  {
    let res =-1;

    for(let i=0; i<this.subjects.length && res==-1; i++)
    {
      if(this.subjects[i].id_materia==idSubject)
      {
        res=i;
      }
    }

    return res;
  }

  getTotalPages(){
    return this.totalPages;
  }

  getPages(){
    return this.pages;
  }

  generateArrayOfPages(totalPages: number)
  {
    for (let i = 0; i < totalPages; i++) {
      this.pages.push(i);
    }
  }

  setCoverImages() {

    console.log(this.imagesOfSubjectId);

    this.imagesOfSubjectId.forEach((image: any, key: number) =>
    {
      let imageConverted= Uint8Array.from(image);

      let imgUrl= URL.createObjectURL(
        new Blob([imageConverted.buffer], { type: 'image/png' }));

      var img = document.getElementById(`${key}`) as HTMLImageElement;

      //console.log(img);
      img.src= imgUrl;
    });

  }
}
