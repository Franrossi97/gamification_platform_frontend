import { faTrashAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { Flashcard } from './../../shared/Flashcard';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-flashcard',
  templateUrl: './edit-flashcard.component.html',
  styleUrls: ['./edit-flashcard.component.scss']
})
export class EditFlashcardComponent implements OnInit {

  ID_FLASHCARD: number;
  flashcard: Flashcard;
  editFlashcardForm: FormGroup;
  editFlashcardItemForm: FormGroup;
  showFlashcardForm: boolean=false;
  showFlashcardItemForm: number=-1;
  updateTitleError: boolean=false;
  updateItemError: boolean=false;
  trashIcon=faTrashAlt;
  arrowLeft= faArrowLeft;

  constructor(private fb: FormBuilder, private flashcardService: FlashcardService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.ID_FLASHCARD=+param.get('id_flashcard');
      this.flashcard=new Flashcard(this.ID_FLASHCARD);
      this.getFlahscardInformation(this.ID_FLASHCARD);
      this.setFlashcardTitle(this.ID_FLASHCARD);
    });

  }

  createFlashcardForm()
  {
    this.editFlashcardForm=this.fb.group(
    {
      title: new FormControl('', [Validators.required])
    });
  }

  onShowFlashcardForm(value: string)
  {
    this.showFlashcardForm=true;
    this.createFlashcardForm();

    this.editFlashcardForm.get('title').setValue(value);
  }

  onEditFlashcardTitle()
  {
    this.flashcardService.editFlashcard(this.flashcard.id_nivel, this.editFlashcardForm.get('title').value).subscribe(res =>
    {
      this.showFlashcardForm=false;
      this.flashcard.titulo=this.editFlashcardForm.get('title').value;
      this.updateTitleError=false;
    }, err =>
    {
      this.updateTitleError=true;
    });
  }

  onDeleteFlashcard()
  {
    this.flashcardService.deleteFlashcard(this.flashcard.id_flashcard).subscribe(res =>
    {
      this.router.navigate(['flashcards', 'list']);
    });
  }

  createFlashcardItemForm()
  {
    this.editFlashcardItemForm=this.fb.group(
    {
      content: new FormControl('', [Validators.required])
    });
  }

  onCancelEditFlashcard()
  {
    this.showFlashcardForm=false;
  }

  onShowFlashcardItemForm(index: number, value: string)
  {
    this.showFlashcardItemForm=index;
    this.createFlashcardItemForm();

    this.editFlashcardItemForm.get('content').setValue(value);

    this.updateItemError=false;
  }

  onEditFlashcardItem(idItem: number)
  {
    this.flashcardService.editFlashcardItem(idItem, this.editFlashcardItemForm.get('content').value).subscribe(res =>
    {
      this.updateItemError=false;
    }, err =>
    {
      this.updateItemError=true;
    });
  }

  onCancelEditItem()
  {
    this.showFlashcardItemForm=-1;
  }

  getFlahscardInformation(idFlashcard: number)
  {
    this.flashcardService.getFlashcardItems(idFlashcard).subscribe(res =>
    {
      this.flashcard.items=res;
    });
  }

  onDeleteFlashcardItem(idItem: number, index: number)
  {
    this.flashcardService.deleteFlashcardItem(idItem).subscribe(res =>
    {
      this.flashcard.items.splice(index, 1);
    });
  }

  setFlashcardTitle(idFlashcard: number)
  {
    this.flashcardService.getFlashcardTitle(idFlashcard).subscribe(value =>
    {
      this.flashcard.titulo=value.titulo;
    });
  }

  onBack()
  {
    this.router.navigate(['flashcards', 'list']);
  }
}
