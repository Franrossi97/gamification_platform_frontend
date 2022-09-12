import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTrashAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { Flashcard } from './../../shared/Flashcard';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-flashcard',
  templateUrl: './edit-flashcard.component.html',
  styleUrls: ['./edit-flashcard.component.scss']
})
export class EditFlashcardComponent implements OnInit {

  ID_FLASHCARD: number;
  flashcard: Flashcard;
  editFlashcardForm: UntypedFormGroup;
  editFlashcardItemForm: UntypedFormGroup;
  showFlashcardForm = false;
  showFlashcardItemForm = -1;
  updateTitleError = false;
  updateItemError = false;
  trashIcon=faTrashAlt;
  arrowLeft= faArrowLeft;
  editFlashcardItemId: number;
  editFlashcardItemIndex: number;

  constructor(private fb: UntypedFormBuilder, private flashcardService: FlashcardService, private route: ActivatedRoute,
    private router: Router, private modalService: NgbModal) { }

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
      title: new UntypedFormControl('', [Validators.required])
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
    this.flashcardService.editFlashcard(this.flashcard.id_nivel, this.editFlashcardForm.get('title').value).subscribe(() =>
    {
      this.showFlashcardForm=false;
      this.flashcard.titulo=this.editFlashcardForm.get('title').value;
      this.updateTitleError=false;
    }, () =>
    {
      this.updateTitleError=true;
    });
  }

  onDeleteFlashcard()
  {
    this.flashcardService.deleteFlashcard(this.flashcard.id_flashcard).subscribe(() =>
    {
      this.closeModal();
      this.router.navigate(['flashcards', 'list']);
    });
  }

  createFlashcardItemForm()
  {
    this.editFlashcardItemForm=this.fb.group(
    {
      content: new UntypedFormControl('', [Validators.required])
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
    this.flashcardService.editFlashcardItem(idItem, this.editFlashcardItemForm.get('content').value).subscribe(() =>
    {
      this.updateItemError=false;
    }, () =>
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
    this.flashcardService.deleteFlashcardItem(idItem).subscribe(() =>
    {
      this.flashcard.items.splice(index, 1);
      this.editFlashcardItemId = -1;
      this.editFlashcardItemIndex = -1;
      this.closeModal();
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

  openDeleteFlashcard(content)
  {
    this.modalService.open(content);
  }

  openDeleteFlashcardItem(content, flashcardItemId: number, flashcardItemIndex: number) {
    this.editFlashcardItemId = flashcardItemId;
    this.editFlashcardItemIndex = flashcardItemIndex;

    this.modalService.open(content);
  }

  closeModal() {
    this.modalService.dismissAll()
  }
}
