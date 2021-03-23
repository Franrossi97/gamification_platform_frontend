import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-question-type',
  templateUrl: './select-question-type.component.html',
  styleUrls: ['./select-question-type.component.scss']
})
export class SelectQuestionTypeComponent implements OnInit
{

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onSelectType(questionType: number)
  {
    this.router.navigate([`level/${this.route.snapshot.params.id}/question/create/${questionType}`])
  }
}
