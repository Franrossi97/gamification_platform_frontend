import { UserService } from './../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ParticipantsListService } from './../services/participants-list.service';
import { Component, OnInit } from '@angular/core';
import {faPlusSquare, faSortAlphaDown, faSortNumericDown, faStar, faTimes, faMinusSquare, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

const BADGES_NAMES=[
  'Insignia de pregunta',
  'Insignia de tiempo máximo',
  'Insignia de fecha',
  'Insignia de intentos'],
  MAX_BADGES=4;

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent implements OnInit
{
  SUBJECT_ID: number;
  envelopeIcon= faEnvelope;
  plusIcon=faPlusSquare;
  minusIcon= faMinusSquare;
  alphabeticalOrder= faSortAlphaDown;
  numericalOrder= faSortNumericDown;
  achievementOrder= faStar;
  noOrder= faTimes;
  showMoreInfo=-1;
  students: ListStudents[]=new Array<ListStudents>();
  closeResult;
  selectedUserId: number;
  selectedUserName: string;
  availableFilters: Array<boolean>=new Array<boolean>(4);
  private showError=false;
  private showDeleteQuestion=false;
  showEmailMenu= false;
  emailsToSend: Array<string>=new Array<string>();

  deleteUser: number;
  deleteUserIndex: number;

  constructor(private participantsListService: ParticipantsListService, private userService: UserService,
    private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.SUBJECT_ID=params.id_subject;
      this.availableFilters.fill(true);
      this.availableFilters[0]=false;
      this.participantsListService.getParticipantsForSubject(this.SUBJECT_ID,0).subscribe((students: ListStudents[]) =>
      {
        this.students=students;
      }, err => {
        this.showError=true;
      });
    });
  }

  setMoreInfo(idUser: number)
  {
    this.showMoreInfo=(this.showMoreInfo==idUser) ? -1 : idUser;
  }

  getBadgeName(nameIndex: string)
  {
    let res='', i=0;
    const nameIndexPasLeft=this.stringPadLeft(nameIndex);

    BADGES_NAMES.forEach(name =>
    {

      if(nameIndexPasLeft[i++]=='1')
      {
        res+=name+"\n";
      }
    });
    return res==''?'NINGUNA':res;
  }

  stringPadLeft(binaryNumber: string): string
  {
    const concatString='';
    for(let i=0; i<(MAX_BADGES-binaryNumber.length); i++)
    {
      concatString.concat('0');
    }

    return concatString+binaryNumber;
  }

  openAchievementMenu(content)
  {
    //this.selectedUserId=1;
    this.modalService.open(content).result.then(res =>
    {
      this.closeResult=`Closed with: ${res}`;
    }, err => console.log(err))
    .catch(err => console.log(err));
  }

  assignAchieveToUser(content, studentId: number, studentName: string)
  {
    this.openAchievementMenu(content);

    this.selectedUserId=studentId;
    this.selectedUserName=studentName;
  }

  applyFilter(filterIndex: number)
  {
    this.availableFilters.fill(true);
    this.availableFilters[filterIndex]=false;
    this.participantsListService.getParticipantsForSubject(this.SUBJECT_ID, filterIndex).subscribe((resFilter: ListStudents[]) =>
    {
      this.students=resFilter;
      this.showError=false;
    }, err => {
      this.showError=true;
    });
  }

  showUnlinkUser(idUser: number, userIndex: number) {
    this.showDeleteQuestion=true;

    this.deleteUser= idUser;
    this.deleteUserIndex= userIndex;
  }

  unlinkUser() {
    this.showDeleteQuestion=true;

    this.userService.unlinkUser(this.deleteUser, this.SUBJECT_ID).subscribe(res => {
      this.students.splice(this.deleteUserIndex, 1);
    }, err => {
      this.showError=true;
    });

  }

  onSendEmail(email: string) {
    this.showEmailMenu=true;
    this.emailsToSend.length=0;
    this.emailsToSend.push(email);
  }

  async onSendEmailAll() {
    this.emailsToSend.length=0;
    await this.loadAllEmails();
    this.showEmailMenu=true;
  }

  loadAllEmails() {
    this.students.forEach(student =>{
      this.emailsToSend.push(student.mail);
    });
  }

  onCancelSendEmail(event) {
    this.emailsToSend.length=0;
    this.showEmailMenu=false;
  }

  getShowError() {
    return this.showError;
  }

  setShowError(value: boolean) {
    this.showError= value;
  }

  getShowDeleteQuestion() {
    return this.showDeleteQuestion;
  }

  setShowDeleteQuestion(value: boolean) {
    this.showDeleteQuestion= value;
  }
}

interface ListStudents
{
  id_usuario: number,
  nombre: string,
  apellido: string,
  mail: string,
  puntaje_prom: number,
  puntaje_tot: number,
  levelResult: LevelResultList[];
}

interface LevelResultList
{
  descripcion: string,
  intentos: number,
  puntaje_final: number,
  uso_booster: boolean,
  uso_insignias: string,
  puntaje_maximo: number,
}
