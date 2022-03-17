import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { Flashcard } from './../../shared/Flashcard';
import { Component, OnInit } from '@angular/core';
import { FlashcardItem } from 'src/app/shared/FlashcardItem';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-flashcard',
  templateUrl: './edit-flashcard.component.html',
  styleUrls: ['./edit-flashcard.component.scss']
})
export class EditFlashcardComponent implements OnInit {

  flashcard: Flashcard;
  editFlashcardForm: FormGroup;
  editFlashcardItemForm: FormGroup;
  showFlashcardForm: boolean=false;
  showFlashcardItemForm: number=-1;
  updateTitleError: boolean=false;
  updateItemError: boolean=false;
  trashIcon=faTrashAlt;

  constructor(private fb: FormBuilder, private flashcardService: FlashcardService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void
  {
    /*
    let flashcardItems: Array<FlashcardItem>=new Array<FlashcardItem>();
    flashcardItems.push(new FlashcardItem(1, 'La programación permite solucionar problemas'));
    flashcardItems.push(new FlashcardItem(2, 'La programación permite solucionar problemas'));
    flashcardItems.push(new FlashcardItem(3, 'La programación permite solucionar problemas'));
    flashcardItems.push(new FlashcardItem(4, 'La programación permite solucionar problemas'));
    flashcardItems.push(new FlashcardItem(5, 'La programación permite solucionar problemas'));
    flashcardItems.push(new FlashcardItem(6, 'La programación permite solucionar problemas'));*/

    this.flashcard=new Flashcard(1, null, 'Programación', 1, 'Programación I', 0, null);

    this.route.paramMap.subscribe(param =>
    {
      //console.log(param.get('id_flashcard'));

      this.getFlahscardInformation(+param.get('id_flashcard'));
    });
    this.setFlashcardTitle();

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
    //this.createFlashcardItemForm=null;
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
    //this.createFlashcardItemForm=null;
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

  setFlashcardTitle()
  {
    this.flashcardService.getFlashcardTitle().subscribe(title =>
    {
      this.flashcard.titulo=title;
    });
  }
}
