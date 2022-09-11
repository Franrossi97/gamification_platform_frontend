import { Location } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-question-type',
  templateUrl: './select-question-type.component.html',
  styleUrls: ['./select-question-type.component.scss']
})
export class SelectQuestionTypeComponent implements OnInit
{
  arrowLeftIcon = faArrowLeft;
  ID_SUBJECT: number;
  ID_LEVEL: number;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.ID_SUBJECT = this.route.snapshot.params.id_subject;
    this.ID_LEVEL = this.route.snapshot.params.id;
  }

  onSelectType(questionType: number)
  {
    this.router.navigate([`subject/${this.route.snapshot.params.id_subject}/level/${this.route.snapshot.params.id}/question/create/${questionType}`])
  }

  onGoQuestionBank() {
    this.router.navigate(['subject', this.ID_SUBJECT, 'level', this.ID_LEVEL, 'edit']);
  }

  onGoBack() {
    this.location.back();
  }
}
