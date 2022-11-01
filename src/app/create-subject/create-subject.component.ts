import { Router } from '@angular/router';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
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

  newSubjectForm: UntypedFormGroup;
  subject: SubjectClass=null;
  uploadPic;
  fileName: string;
  fileData: FormData;
  fileS: ImageSnippet;
  fileSizeError = false;
  fileTypeError = false;
  private loadingSubmit = false;
  loadButtonDisabled = false;

  @ViewChild('fform') newSubjectFormDirective;

  constructor(private fb: UntypedFormBuilder, private subjectService: SubjectService, private router: Router) { }

  ngOnInit(): void
  {
    this.createForm();
  }

  createForm()
  {
    this.newSubjectForm=this.fb.group(
    {
      name: new UntypedFormControl(null, [Validators.required,Validators.minLength(2),Validators.maxLength(35)]),
      quarter: new UntypedFormControl(null, [Validators.required]),
      year: new UntypedFormControl(null, [Validators.required,Validators.minLength(4),Validators.maxLength(4)]),
      career: new UntypedFormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(40)]),
      image: new UntypedFormControl(null),
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
    this.loadButtonDisabled = true;
    let fileName: string= null;

    if(this.fileS) {
      fileName =
      `${this.newSubjectForm.get('year').value}_${this.newSubjectForm.get('career').value}_${this.fileS.file.name}`;
    }

    this.subject=new SubjectClass(this.newSubjectForm.get('name').value,
    this.newSubjectForm.get('quarter').value, this.newSubjectForm.get('year').value, this.newSubjectForm.get('career').value,
    0, true, true, fileName, +localStorage.getItem('userId'));

    if(this.newSubjectForm.get('image').value != null){
      this.subjectService.uploadCoverImage(fileName, this.fileS.file).subscribe(res =>
      {
        this.submitRestOfForm();
      }, err => {
        this.loadButtonDisabled = false;
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
    }, err =>
    {
      this.loadButtonDisabled = false;
    });
  }

  getLoadingSubmit() {
    return this.loadingSubmit;
  }
}
