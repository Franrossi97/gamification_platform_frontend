import { fadeIn } from './../../animations/FadeIn';
import { SubjectService } from './../../services/subject.service';
import { SubjectClass } from 'src/app/shared/Subject';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { generateArrayOfSubjectsId, generateMapOfImageOfSubjectsId } from '../Utils/utilPictures';

@Component({
  selector: 'app-cursando',
  templateUrl: './cursando.component.html',
  styleUrls: ['./cursando.component.scss'],
  animations: [ fadeIn ]
})
export class CursandoComponent implements OnInit {

  private USER_ID: number=0;
  private subjects: Array<SubjectClass>=new Array<SubjectClass>();
  private imagesOfSubjectId: Map<number, any>= new Map<number, any>();

  private actualPage: number=0;
  private totalPages: number=0;
  private pages: Array<number>=new Array<number>();

  constructor(private subjectService: SubjectService, private domSanitizer: DomSanitizer) { }

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
    this.subjectService.getSubjectsForStudent(this.USER_ID, (page)*(cantPerPage-1), cantPerPage).subscribe(async subjects =>
    {
      this.subjects=subjects;

      //let subjectsId=await this.generateArrayOfSubjectsId();
      let subjectsId=await generateArrayOfSubjectsId(this.subjects);

      this.subjectService.getCoverImages(subjectsId).subscribe(res =>
      {
        this.imagesOfSubjectId=generateMapOfImageOfSubjectsId(res);
        //this.generateMapOfImageOfSubjectsId(res);

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

  /*async generateArrayOfSubjectsId(): Promise<Array<number>> {
    let res: Array<number>= new Array<number>();

    this.subjects.forEach(subject =>
    {
      res.push(subject.id_materia);
    });

    return res;
  }*/

  /*generateMapOfImageOfSubjectsId(images: Array<{subjectId: number, image: Array<any>}>) {
    images.forEach(imageInfo =>
    {
      this.imagesOfSubjectId.set(imageInfo.subjectId, imageInfo.image);
    });
  }*/

  setCoverImages(){
    this.imagesOfSubjectId.forEach((image: any, key: number) =>
    {
      let imageConverted= Uint8Array.from(image);

      let imgUrl= URL.createObjectURL(
        new Blob([imageConverted.buffer], { type: 'image/png' }));

      var img = document.getElementById(`${key}`) as HTMLImageElement;

      img.src= imgUrl;
    });
  }
}
