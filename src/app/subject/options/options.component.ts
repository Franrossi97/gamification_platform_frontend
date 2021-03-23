import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from './../../services/subject.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  showNewLevel:boolean;
  userType:number;
  closeResult='';
  constructor(private modalService:NgbModal, private subjectService: SubjectService,
  private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void
  {
    this.showNewLevel=false;
  }


  onClickNewLevel(content)
  {
    this.modalService.open(content).result.then(res =>
    {
      this.closeResult=`Closed with: ${res}`;
    }, err => console.log(err))
    .catch(err => console.log(err));
  }

  onClickNewUser(content, userType: number)
  {
    this.userType=userType;
    this.modalService.open(content).result.then(res =>
    {
      this.closeResult=`Closed with: ${res}`;
    }, err => console.log(err))
    .catch(err => console.log(err));
  }

  onClickDelete()
  {
    const idSubject=this.route.snapshot.params.id;
    this.subjectService.deleteSubject(idSubject).subscribe(res =>
    {
      console.log(res);
      this.router.navigate(['home']);
    });
  }

}
