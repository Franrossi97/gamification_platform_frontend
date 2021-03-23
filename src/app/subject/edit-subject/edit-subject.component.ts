import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit
{
  @Input() editingLevelId:number;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }


  onAddQuestion()
  {
    //this.router.navigate([`level/${this.editingLevelId}/question/create`])
    return `/level/${this.editingLevelId}/question/create/select`;
  }

}
