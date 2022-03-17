import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { FlashcardItem } from './../../shared/FlashcardItem';
import { Flashcard } from './../../shared/Flashcard';
import { SubjectService } from './../../services/subject.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectClass } from 'src/app/shared/Subject';
import { Level } from 'src/app/shared/Level';

@Component({
  selector: 'app-create-flashcard',
  templateUrl: './create-flashcard.component.html',
  styleUrls: ['./create-flashcard.component.scss']
})
export class CreateFlashcardComponent implements OnInit
{

  idSubjectSelected: number;
  newFlashCardInformationForm: FormGroup;
  subjectsToSelect: Array<SubjectClass>;
  levelsForSelectedSubject: Array<Level>;
  showErrorMessage: boolean=false;
  trashIcon=faTrashAlt;

  @ViewChild('fform') newFlashCardInformationFormDirective;

  constructor(private fb: FormBuilder, private subjectService: SubjectService, private flashcardService: FlashcardService,
  private router: Router) { }

  ngOnInit(): void
  {
    this.creatNewFlashcardForm();
    this.getSubjectForSelect();
  }


  getSubjectForSelect()
  {
    this.subjectService.getSubjectsForTeacher(localStorage.getItem('userId')).subscribe(res =>
    {
      this.subjectsToSelect=res;
      //console.log(this.subjectsToSelect);
    });
  }

  creatNewFlashcardForm()
  {
    this.newFlashCardInformationForm=this.fb.group(
    {
      subject: new FormControl(null, Validators.required),
      level: new FormControl(null, Validators.required),
      title: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
      items: this.fb.array([], Validators.required),
    });

    this.onSubjectSelected();
  }

  onSubjectSelected()
  {
    this.newFlashCardInformationForm.get('subject').valueChanges.subscribe(idSubject =>
    {
      this.getLevelsForSubject(idSubject);
      this.idSubjectSelected=idSubject;

      this.onLevelSelected();
    });
  }

  getLevelsForSubject(idSubject: string)
  {
    this.subjectService.getLevels(idSubject).subscribe(res =>
    {
      this.levelsForSelectedSubject= res.length>0 ? res : null
    });
  }

  onLevelSelected()
  {
    this.newFlashCardInformationForm.get('level').valueChanges.subscribe(async idLevel =>
    {
      if(idLevel!=''){
        let levelInfo: Level;
        levelInfo=await this.levelsForSelectedSubject.find(level => level.id_nivel=idLevel);
        this.newFlashCardInformationForm.controls['title'].setValue(levelInfo.descripcion);
      }
      else{
        this.newFlashCardInformationForm.controls['title'].setValue('');
      }
    });
  }

  onAddNewFlashcardItem()
  {
    const control=new FormControl('', [Validators.required, Validators.minLength(10)]);

    this.getItemsControl().push(control);
  }

  onRemoveNewFlashcardItem(index: number)
  {
    this.getItemsControl().removeAt(index);
  }

  getItemsControl()
  {
    return this.newFlashCardInformationForm.get('items') as FormArray;
  }

  onCreateFlashcard()
  {
    let newFlashcard: Flashcard;
    //console.log(this.getItemsControl().controls);

    newFlashcard=new Flashcard(null, this.newFlashCardInformationForm.get('title').value,
    null, null, null, 0, this.generateArrayFlashcardItems());
    newFlashcard.id_nivel=this.newFlashCardInformationForm.get('level').value

    console.log(newFlashcard, this.generateArrayFlashcardItems());

    this.flashcardService.postFlashcard(newFlashcard).subscribe(res =>
    {
      //console.log('subido');
      this.showErrorMessage=false;
      this.router.navigate(['flashcards', 'list']);
    }, err =>
    {
      this.showErrorMessage=true;
    });
  }

  generateArrayFlashcardItems()
  {
    let res=new Array<FlashcardItem>();
    this.getItemsControl().controls.forEach(control =>
    {
      res.push(control.value);
    });

    return res;
  }
}
