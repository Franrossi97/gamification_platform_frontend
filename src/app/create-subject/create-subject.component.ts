import { Router } from '@angular/router';
import { SubjectService } from './../services/subject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubjectClass } from '../shared/Subject';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.scss']
})
export class CreateSubjectComponent implements OnInit {

  newSubjectForm: FormGroup;
  subject: SubjectClass=null;
  uploadPic;
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

  onFileChanged(e)
  {
    this.uploadPic = e.target.files[0];
  }

  onSubmit()
  {
    //const uploadImageData = new FormData();
    this.subject=new SubjectClass(this.newSubjectForm.get('name').value,
    this.newSubjectForm.get('quarter').value, this.newSubjectForm.get('year').value, this.newSubjectForm.get('career').value,
    0, true, true, null, +localStorage.getItem('userId'));

    //llamar a servicio
    this.subjectService.createSubject(this.subject, localStorage.getItem('userId')).subscribe(res =>
    {
      this.newSubjectForm.reset();
      this.router.navigate([`/subject/${res}`]);
    }, err =>
    {
      //Lanzar error
    });
    /*
    console.log(uploadImageData);

    this.SubjectService.uploadCoverImage(this.subject.nombre+this.subject.anio, uploadImageData).subscribe(res =>
    {
      console.log('van las cosas bien');
    });*/
  }
}
