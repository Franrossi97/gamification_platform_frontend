import { UserService } from './../../services/user.service';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { Component, OnInit } from '@angular/core';
import { FlashcardItem } from 'src/app/shared/FlashcardItem';
import { Flashcard } from 'src/app/shared/Flashcard';

@Component({
  selector: 'app-show-flashcards',
  templateUrl: './show-flashcards.component.html',
  styleUrls: ['./show-flashcards.component.scss']
})
export class ShowFlashcardsComponent implements OnInit {

  faAngleDoubleLeft
  ID_FLASHCARD: number;
  flashcard: Flashcard;
  flashcardItems: Array<FlashcardItem>;
  showFlashcardItem: FlashcardItem;
  flashcardCount=-1;
  showEnd=false;
  selectedError=false;
  blockButtons=false;
  arrowLeftIcon= faArrowLeft;
  arrowRightIcon= faArrowRight;

  constructor(private flashcardService: FlashcardService, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(params =>
    {
      this.ID_FLASHCARD = +params.get('id_flashcard');

      this.getFlashcard(this.ID_FLASHCARD);

      this.getFlashcardItems(this.ID_FLASHCARD);
    });
  }

  getFlashcard(idFlashcard: number)
  {
    this.flashcardService.getFlashcardById(idFlashcard).subscribe(flashcard =>
    {
      this.flashcard=flashcard;

      this.checkSaveResult(this.flashcard.id_materia);
    });
  }

  getFlashcardItems(idFlashcard: number)
  {
    this.flashcardService.getFlashcardItems(idFlashcard).subscribe(res =>
    {
      this.flashcardItems=res;

      this.showFlashcard();
    });
  }

  showFlashcard()
  {
    this.selectedError=false;
    if(this.flashcardCount<(this.flashcardItems.length-1))
    {
      this.showFlashcardItem=this.flashcardItems[++this.flashcardCount];
    }
    else
    {
      this.showTheEnd();
    }
  }

  onSelectAnswer(idItem: number, answer: number)
  {
    if(!this.blockButtons)
    {
      //console.log('respuesta', answer);
      this.flashcardService.registerFlashcardResult(idItem, +localStorage.getItem('userId'), answer).subscribe(() =>
      {
        this.showFlashcard();
      }, () =>
      {
        this.selectedError=true;
      });
    }
    else
    {
      this.showFlashcard();
    }

  }

  checkSaveResult(idSubject: number)
  {
    this.userService.numberUserType(+localStorage.getItem('userId'), idSubject).then(res =>
    {
      this.blockButtons=res!=2; //bloquear botones para no guardar desempeño
    });
  }

  selectFlashcard(direction: number)
  {
    //console.log(direction, this.flashcardCount);

    if(direction==0)
    {
      if(this.flashcardCount>0) this.showFlashcardItem=this.flashcardItems[--this.flashcardCount];
    }
    else
    {
      (this.flashcardCount< (this.flashcardItems.length-1)) ? this.showFlashcardItem=this.flashcardItems[++this.flashcardCount] : this.showTheEnd();
    }

    //console.log(this.flashcardCount);
  }

  showTheEnd() {
    this.showEnd=true;
  }
}
