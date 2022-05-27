import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  showErrMessage: boolean= false;
  errorMessage: string= '';
  xIcon=faTimes;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal) { }

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

  onEditBadges(content)
  {
    this.showBadgeMenu=!this.showBadgeMenu;

    this.modalService.open(content).result.then(res =>
    {
      let closeResult=`Closed with: ${res}`;
    }, err => console.log(err))
    .catch(err => console.log(err));
  }

  closeWindow(evn)
  {
    this.showBadgeMenu=false;
    this.modalService.dismissAll('close');
  }

  receiveErrorEvent(event)
  {
    this.showErrorMessage(event);
  }

  showErrorMessage(message)
  {
    this.showErrMessage= true;
    this.errorMessage= message;
  }

  onClickNewLevel(content)
  {
    this.modalService.open(content).result.then(res =>
    {
      let closeResult=`Closed with: ${res}`;
    }, err => console.log(err))
    .catch(err => console.log(err));
  }
}
