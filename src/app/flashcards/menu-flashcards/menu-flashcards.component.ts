import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { ParticipantsListComponent } from './../../participants-list/participants-list.component';
import { Router } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { faSearch, faPager, faTimesCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { Flashcard } from 'src/app/shared/Flashcard';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu-flashcards',
  templateUrl: './menu-flashcards.component.html',
  styleUrls: ['./menu-flashcards.component.scss']
})
export class MenuFlashcardsComponent implements OnInit {

  flashcards: Array<Flashcard>;
  magnifyingIcon=faSearch;
  flashcardIcon=faPager;
  xSymbolIcon=faTimesCircle;
  plusIcon=faPlusCircle;
  showSearchError: boolean=false;
  searchForm: FormGroup;
  dontAllowFilters: Array<boolean>=new Array<boolean>(3);
  allowCreation: boolean=false;

  constructor(private flashcardService: FlashcardService, private router: Router, private fb: FormBuilder,
  private userService: UserService, private permissionService: PermissionService) { }

  ngOnInit(): void
  {
    this.createSearchForm();
    this.getFlashcards(0); //sin filtrar
    this.dontAllowFilters.fill(true);
    this.getUserType();
  }

  getFlashcards(filter: number)
  {
    this.flashcards=new Array<Flashcard>();
    this.flashcards.length=0;
    /*
    this.flashcards.push(new Flashcard(1, 'Introducción a la informática1', 'Hola', 2, 'Chau', 2, null));
    this.flashcards.push(new Flashcard(2, 'Introducción a la informática2', 'Hola', 3, 'Chau', 2, null));
    this.flashcards.push(new Flashcard(3, 'Introducción a la informática3', 'Hola', 4, 'Chau', 2, null));
    this.flashcards.push(new Flashcard(4, 'Introducción a la informática4', 'Hola', 5, 'Chau', 2, null));*/

    this.flashcardService.getFlahscard(+localStorage.getItem('userId'), filter).subscribe(res =>
    {
      this.flashcards=res;
    });
  }

  getSubjectFromCursa()
  {
    this.dontAllowFilters[1] && this.getFlashcards(1);

    this.blockFilter(1);
  }

  getSubjectFromEnsenia()
  {
    this.dontAllowFilters[2] && this.getFlashcards(2);

    this.blockFilter(2);
  }

  getSearchSubject()
  {
    let searchParam: string=this.searchForm.get('search').value;

    if(searchParam!='')
    {
      this.flashcards.length=0;
      this.flashcardService.getFlahscardBySearch(+localStorage.getItem('userId'), searchParam).subscribe(res =>
      {
        this.flashcards=res;
      });
    }
  }

  clearFilters()
  {
    this.dontAllowFilters[0] && this.getFlashcards(0);

    this.blockFilter(0);

    //console.log(this.dontAllowFilters, 'Bloqueo clear filters');
  }

  onEditFlashcard(idFlashcard: number, titleFlashcard: string)
  {
    this.flashcardService.setFlashcardTitle(titleFlashcard);

    this.router.navigate(['flashcards', idFlashcard, 'edit']);
  }

  createSearchForm()
  {
    this.searchForm=this.fb.group(
    {
      search: new FormControl('',[]),
    });
  }

  blockFilter(index: number)
  {
    this.dontAllowFilters.fill(true);

    this.dontAllowFilters[index]=false;
  }

  onCheckResultFlashcard(idFlashcard: number, title: string)
  {
    this.flashcardService.setFlashcardTitle(title);

    this.router.navigate(['flashcards', idFlashcard, 'result']);
  }

  getUserType()
  {
    this.permissionService.canEdit('flashcard').then(res =>
    {
      this.allowCreation=res;
    });/*
    this.userService.canDoTeacherTask(+localStorage.getItem('userId')).then((res: subjectCount) =>
    {
      this.allowCreation=res.cantidad_materias>0;
    });
    this.userService.numberUserType(+localStorage.getItem('userId'), idSubject).then(res =>
    {
      if(res!=2)
      {
        this.blockButtons=true; //bloquear botones para no guardar desempeño
        console.log('No es estudiante');
      }
    });*/
  }

}

interface subjectCount
{
  cantidad_materias: number
}
