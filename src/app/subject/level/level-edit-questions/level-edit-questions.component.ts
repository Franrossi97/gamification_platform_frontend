import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { faArrowLeft, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Option } from '../../../shared/Option';
import { QuestionService } from '../../../services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from '../../../services/level.service';
import { Level } from '../../../shared/Level';
import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/shared/Question';

@Component({
  selector: 'app-level-edit',
  templateUrl: './level-edit-questions.component.html',
  styleUrls: ['./level-edit-questions.component.scss']
})
export class LevelEditComponent implements OnInit {

  ID_LEVEL: number;
  arrowLeft = faArrowLeft;
  editIcon = faPen;
  deleteIcon = faTrash;
  editingLevel: Level;
  editedLevelIndex = -1;
  editingQuestion: Question=null;
  indexEditingOption: number;
  editingOption: Option;
  questions: Array<Question> = new Array<Question>();
  editedAnswer: Array<Option>=new Array<Option>();
  disableAddButtons: Array<boolean>=new Array<boolean>(4);
  disableButtonLoadChange = true;
  showErrorMessage = false;
  errorMessage: string;
  deleteQuestionId: number;
  deleteQuestionIndex: number;

  constructor(private levelService: LevelService, private questionService: QuestionService, private route: ActivatedRoute,
    private router: Router, private location: Location, private modalService: NgbModal) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.ID_LEVEL = +param.get('id_level');

      this.getLevelToEdit(this.ID_LEVEL);

      this.getQuestions(this.ID_LEVEL);

      this.disableAddButtons.fill(false);
    });

    /*this.editingQuestion=new Question(1, 'LALA', 0, 1, 1, 1, null);
    this.createEditAnswerForm();*/
  }

  getLevelToEdit(idLevel: number)
  {
    this.levelService.getOneLevel(idLevel).subscribe(res =>
    {
      this.editingLevel=res;
    });
  }

  getQuestions(idLevel: number)
  {
    this.questionService.getQuestions(idLevel).subscribe(res =>
    {
      this.questions=res;
    });
  }

  onSelectEditQuestion(idQuestion: number, indexQuestion: number)
  {
    this.editedLevelIndex=indexQuestion;

    this.router.navigate(['level', this.ID_LEVEL, 'edit', 'question', idQuestion]);
  }

  onDeleteQuestion(idQuestion: number, indexQuestion: number)
  {
    this.questionService.deleteQuestion(idQuestion).subscribe(res =>
    {
      this.questions.splice(indexQuestion, 1);

      this.cancelDelete();
    }, err =>
    {
      this.setErrorMessage('No se pudo borrar la pregunta. Intente de nuevo.')
    });
  }

  setErrorMessage(message: string)
  {
    this.errorMessage=message;
    this.showErrorMessage=true;
  }

  closeErrorMessage()
  {
    this.errorMessage='';
    this.showErrorMessage=false;
  }

  goBack() {
    this.location.back();
  }

  onDeleteQuestionModal(content, idQuestion: number, indexQuestion: number)
  {
    this.deleteQuestionId = idQuestion;
    this.deleteQuestionIndex = indexQuestion;
    this.modalService.open(content).result.then(res =>
    {
      const closeResult=`Closed with: ${res}`;
    }, err => console.log(err))
    .catch(err => console.log(err));
  }

  cancelDelete() {
    this.modalService.dismissAll();
    this.deleteQuestionId = undefined;
    this.deleteQuestionIndex = undefined;
  }
}
