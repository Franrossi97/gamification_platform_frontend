import { ActivatedRoute } from '@angular/router';
import { ParticipantsListService } from './../services/participants-list.service';
import { Component, OnInit } from '@angular/core';
import {faPlusSquare, faSortAlphaDown, faSortNumericDown, faStar, faTimes} from '@fortawesome/free-solid-svg-icons';
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
  plusIcon=faPlusSquare;
  alphabeticalOrder= faSortAlphaDown;
  numericalOrder= faSortNumericDown;
  achievementOrder= faStar;
  noOrder= faTimes;
  showMoreInfo: number=-1;
  students: ListStudents[]=new Array<ListStudents>();
  closeResult;
  selectedUserId: number;
  selectedUserName: string;
  availableFilters: Array<boolean>=new Array<boolean>(4);

  constructor(private participantsListService: ParticipantsListService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.SUBJECT_ID=params.id_subject;
      this.availableFilters.fill(true);
      this.availableFilters[0]=false;
      this.participantsListService.getParticipantsForSubject(this.SUBJECT_ID,0).subscribe(async (students: ListStudents[]) =>
      {
        this.students=students;
      });
    });
  }

  setMoreInfo(idUser: number)
  {
    this.showMoreInfo=(this.showMoreInfo==idUser) ? -1 : idUser;
  }

  /*generateIdUserArrays(students: ListStudents[])
  {
    let res: Array<number>=new Array<number>(students.length);
    students.forEach(student =>
    {
      res.push(student.id_usuario);
    });

    return new Promise(resolution =>
    {
      resolution(res);
    });
  }*/

  getBadgeName(nameIndex: string)
  {
    let res: string='', i: number=0, nameIndexPasLeft: string=this.stringPadLeft(nameIndex);
    //console.log(nameIndexPasLeft);

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
    let concatString: string='';
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
    });
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
