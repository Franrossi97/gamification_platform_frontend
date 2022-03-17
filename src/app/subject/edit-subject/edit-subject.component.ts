import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit
{
  @Input() editingLevelId: number;
  @Input() subjectId: number;
  showBadgeMenu: boolean=false;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.subjectId=Number(param.get('id'));

      console.log(this.subjectId);
    });
  }

  onAddQuestion()
  {
    //this.router.navigate([`level/${this.editingLevelId}/question/create`])
    return `/subject/${this.subjectId}/level/${this.editingLevelId}/question/create/select`;
  }

  onEditQuestions()
  {
    return `/subject/${this.subjectId}/level/${this.editingLevelId}/edit`;
  }

  onEditBadges()
  {
    this.showBadgeMenu=!this.showBadgeMenu;
  }

  closeWindow(evn)
  {
    this.showBadgeMenu=false;
  }

  receiveErrorEvent(event)
  {
    this.showErrorMessage(event.target.value);
  }

  showErrorMessage(message)
  {

  }
}
