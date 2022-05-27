import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { SubjectService } from './../services/subject.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SubjectClass } from './../shared/Subject';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  magnifying=faSearch;
  searchForm: FormGroup;
  searchResultSubject: Array<SubjectClass>;
  selectedSubject: SubjectClass=null;
  private loadingSearch: boolean= false;

  constructor(private subjectService:SubjectService, private fb: FormBuilder, private userService: UserService,
    private router: Router) { }

  ngOnInit(): void
  {
    this.createSearchForm();
  }

  createSearchForm()
  {
    this.searchForm=this.fb.group(
    {
      search: new FormControl('', [Validators.required]),
    });
  }

  onSearchSubject()
  {
    this.loadingSearch=true;
    this.subjectService.getSubjectBySearch(this.searchForm.get('search').value, +localStorage.getItem('userId')).subscribe(res =>
    {
      this.searchResultSubject=res;
      this.loadingSearch=false;
    });
  }

  onSelectSubject(index: number)
  {
    this.selectedSubject=this.searchResultSubject[index];
  }

  onSingUpSubject(idSubject: number)
  {
    this.userService.linkUsertoSubject(2, +localStorage.getItem('userId'), idSubject).subscribe(res =>
    {
      this.router.navigate(['subject', idSubject]);
    });
  }

  getLoadingSearch() {
    return this.loadingSearch;
  }
}
