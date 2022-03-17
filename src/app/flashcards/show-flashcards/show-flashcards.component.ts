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
  flashcard: Flashcard;
  flashcardItems: Array<FlashcardItem>;
  showFlashcardItem: FlashcardItem;
  flashcardCount: number=-1;
  showEnd: boolean=false;
  selectedError: boolean=false;
  blockButtons: boolean=false;
  arrowLeftIcon= faArrowLeft;
  arrowRightIcon= faArrowRight;

  constructor(private flashcardService: FlashcardService, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(params =>
    {
      this.getFlashcard(+params.get('id_flashcard'));

      this.getFlashcardItems(+params.get('id_flashcard'));

      //console.log(params.get('id_flashcard'));
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

      //console.log(this.flashcardItems);

    });
  }

  showFlashcard()
  {
    this.selectedError=false;
    if(this.flashcardCount<this.flashcardItems.length)
    {
      this.showFlashcardItem=this.flashcardItems[++this.flashcardCount];
    }
    else
    {
      this.showEnd=true;
    }
  }

  onSelectAnswer(idItem: number, answer: number)
  {
    if(!this.blockButtons)
    {
      //console.log('respuesta', answer);
      this.flashcardService.registerFlashcardResult(idItem, +localStorage.getItem('userId'), answer).subscribe(res =>
      {
        this.showFlashcard();
      }, err =>
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
      if(res!=2)
      {
        this.blockButtons=true; //bloquear botones para no guardar desempeño
        //console.log('No es estudiante');
      }
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
      if(this.flashcardCount< (this.flashcardItems.length-1)) this.showFlashcardItem=this.flashcardItems[++this.flashcardCount];
    }

    //console.log(this.flashcardCount);
  }
}
