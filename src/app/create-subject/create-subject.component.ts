import { Router } from '@angular/router';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubjectClass } from '../shared/Subject';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.scss']
})
export class CreateSubjectComponent implements OnInit {

  newSubjectForm: FormGroup;
  subject: SubjectClass=null;
  uploadPic;
  fileName: string;
  fileData: FormData;
  fileS: ImageSnippet;
  fileSizeError: boolean=false;
  fileTypeError: boolean=false;
  private loadingSubmit: boolean=false;

  @ViewChild('fform') newSubjectFormDirective;

  constructor(private fb: FormBuilder, private subjectService: SubjectService, private router: Router) { }

  ngOnInit(): void
  {
    this.createForm();
  }

  createForm()
  {
    this.newSubjectForm=this.fb.group(
    {
      name: new FormControl(null, [Validators.required,Validators.minLength(2),Validators.maxLength(35)]),
      quarter: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required,Validators.minLength(4),Validators.maxLength(4)]),
      career: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40)]),
      image: new FormControl(null),
    });

    //this.newSubjectForm.valueChanges.subscribe(data => {});
  }

  onImageChanged(imageInput){
    this.fileSizeError=false;
    this.fileTypeError=false;

    const file: File = imageInput.files[0];
    const reader= new FileReader();

    if(file){
      //reader.addEventListener('load', e =>{
        this.fileS= new ImageSnippet('ok', file);
      //});

      if(this.fileS.file.size > 92160){
        this.fileSizeError=true;
      }

      console.log(this.fileS.file.type);
      if(this.fileS.file.type != 'image/png' && this.fileS.file.type != 'image/jpeg'){
        this.fileTypeError=true;
      }
    }
  }

  onSubmit()
  {
    this.loadingSubmit=true;
    const fileName: string=
    `${this.newSubjectForm.get('year').value}_${this.newSubjectForm.get('career').value}_${this.fileS.file.name}`;
    this.subject=new SubjectClass(this.newSubjectForm.get('name').value,
    this.newSubjectForm.get('quarter').value, this.newSubjectForm.get('year').value, this.newSubjectForm.get('career').value,
    0, true, true, fileName, +localStorage.getItem('userId'));

    if(this.newSubjectForm.get('image').value != null){
      this.subjectService.uploadCoverImage(fileName, this.fileS.file).subscribe(res =>
      {
        this.submitRestOfForm();
      });
    }
    else{
      this.submitRestOfForm();
    }

  }

  submitRestOfForm() {
    this.subjectService.createSubject(this.subject, localStorage.getItem('userId')).subscribe(lastInsertedId =>
    {
      this.newSubjectForm.reset();
      this.router.navigate([`/subject/${lastInsertedId}`]);

      this.loadingSubmit=true;
    }, err =>
    {
      //Lanzar error
    });
  }

  getLoadingSubmit() {
    return this.loadingSubmit;
  }
}
