import { PermissionService } from './../../services/permission.service';
import { UserService } from './../../services/user.service';
import { ParticipantsListComponent } from './../../participants-list/participants-list.component';
import { Router } from '@angular/router';
import { FlashcardService } from './../../services/flashcard.service';
import { faSearch, faPager, faTimesCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { Flashcard } from 'src/app/shared/Flashcard';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';

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
  showSearchError = false;
  searchForm: UntypedFormGroup;
  dontAllowFilters: Array<boolean>=new Array<boolean>(3);
  allowCreation = false;

  constructor(private flashcardService: FlashcardService, private router: Router, private fb: UntypedFormBuilder,
  private permissionService: PermissionService) { }

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
    const searchParam: string=this.searchForm.get('search').value;

    if(searchParam!='')
    {
      this.flashcards.length=0;
      this.flashcardService.getFlahscardBySearch(+localStorage.getItem('userId'), searchParam).subscribe(res =>
      {
        this.flashcards=res;
        this.dontAllowFilters.fill(true);
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
      search: new UntypedFormControl('',[]),
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
