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
  @ViewChild('fform') newSubjectFormDirective;

  constructor(private fb: FormBuilder, private SubjectService: SubjectService, private router: Router) { }

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
    });

    //this.newSubjectForm.valueChanges.subscribe(data => {});
  }

  onSubmit()
  {
    this.subject.nombre=this.newSubjectForm.get('name').value;
    this.subject.cuatrimestre=this.newSubjectForm.get('quarter').value;
    this.subject.anio=this.newSubjectForm.get('year').value;
    this.subject.carrera=this.newSubjectForm.get('career').value;

    //llamar a servicio
    this.SubjectService.createSubject(this.subject, localStorage.getItem('userId')).subscribe(res =>
    {
      this.newSubjectForm.reset();
      this.router.navigate([`/subject/${res[0].id_materia}`])
    });

    /*this.itemService.editItemName(this.idItem,this.editFolder.get("itemname").value).subscribe(
      {
        next:response =>
        {
          console.log(response);
          this.newNameEvent.emit(response);

        },
        error:error =>
        {
          console.log(`Could not edit the list item. Error: ${error.message}`);
          this.newNameEvent.emit("new name");
        }
      });*/
  }
}
