import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Option } from './../../../shared/Option';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { QuestionService } from './../../../services/question.service';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from './../../../services/level.service';
import { Level } from './../../../shared/Level';
import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/shared/Question';

@Component({
  selector: 'app-level-edit',
  templateUrl: './level-edit.component.html',
  styleUrls: ['./level-edit.component.scss']
})
export class LevelEditComponent implements OnInit {

  plusIcon=faPlus;
  XIcon=faTimes;
  editQuestionForm: FormGroup=null;
  editFeaturesForm: FormGroup=null;
  editingLevel: Level;
  editedLevelIndex: number=-1;
  editingQuestion: Question=null;
  indexEditingOption: number;
  editingOption: Option;
  questions: Array<Question>;
  editedAnswer: Array<Option>=new Array<Option>();
  disableAddButtons: Array<boolean>=new Array<boolean>(4);
  disableButtonLoadChange: boolean=true;
  showErrorMessage: boolean=false;
  errorMessage: string;

  constructor(private levelService: LevelService, private questionService: QuestionService, private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(param =>
    {
      this.getLevelToEdit(+param.get('id_level'));

      this.getQuestions(+param.get('id_level'));

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
    this.questionService.getOptionsforQuestion(idQuestion).subscribe(async res =>
    {
      this.editingQuestion=this.questions[indexQuestion];

      this.editingQuestion.opciones=res;

      this.editedAnswer.length=0;

      this.editingOption=null;

      this.editedLevelIndex=indexQuestion;

      await this.createEditFeaturesForm();
    }, err =>
    {
      this.setErrorMessage('Error al cargar las opciones de la pregunta. Intente de nuevo.');
    });
  }

  onDeleteQuestion(idQuestion: number, indexQuestion: number)
  {
    this.questionService.deleteQuestion(idQuestion).subscribe(res =>
    {
      this.questions.splice(indexQuestion, 1);
    }, err =>
    {
      this.setErrorMessage('No se pudo borrar la pregunta. Intente de nuevo.')
    });
  }

  onSelectOption(idOption: number, indexOption: number)
  {
    this.createEditAnswerForm();

    //this.editQuestionForm.controls['answer'].enable();
    this.disableButtonLoadChange=false;
    this.indexEditingOption=indexOption;
    this.editingOption=this.editingQuestion.opciones[indexOption];
    this.editQuestionForm.controls['answer'].setValue(this.editingOption.texto);
  }

  odEditAnswer()
  {
    if(this.editingOption!=null)
    {
      this.disableAddButtons[this.indexEditingOption]=true;
      this.editedAnswer.push(new Option(this.editQuestionForm.get('answer').value, null, null, this.editingOption.id_opcion));
      //this.editQuestionForm.controls['answer'].disable();
      this.disableButtonLoadChange=true
      this.editQuestionForm.controls['answer'].setValue('');
    }
  }

  onLoadAll()
  {
    this.questionService.editOptions(this.editedAnswer).subscribe(res =>
    {
      this.resetAll();
      this.editingLevel=null;
    }, err =>
    {
      this.setErrorMessage('Ocurrio un error al modificar la opción. Intente de nuevo.');
    });
  }

  resetAll()
  {
    this.disableAddButtons.fill(false);
    this.editedAnswer.length=0;
    this.editingOption=null;
    this.editQuestionForm.controls['answer'].setValue('');
  }

  createEditAnswerForm()
  {
    this.editQuestionForm=this.fb.group(
    {
      answer: new FormControl('', Validators.required),
    });

    //this.editQuestionForm.controls['answer'].disable();
  }

  createEditFeaturesForm()
  {
    this.editFeaturesForm=this.fb.group(
    {
      time: new FormControl(this.questions[this.editedLevelIndex].tiempo, [Validators.required, Validators.min(0)]),
      coins: new FormControl(this.questions[this.editedLevelIndex].recompensa, [Validators.required, Validators.min(0)]),
    });
  }

  onEditFeatures()
  {
    let editedFeatures: Question=new Question(0, null, undefined, null, null,
      this.editFeaturesForm.get('time').value, this.editFeaturesForm.get('coins').value, null, null);

    this.questionService.editQuestion(this.questions[this.editedLevelIndex].id_pregunta, editedFeatures).subscribe(res =>
    {
      console.log('All Good');
    },err =>
    {
      this.setErrorMessage('No se puedo modificar los valores de la pregunta.')
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

  formatDate()
  {
    let dateAux=new Date(this.editingLevel.fecha_recomendada_realizacion);
    let res: string;

    res=(dateAux.getDay()>0 && dateAux.getDay()<10) ? `0${dateAux.getDay()}` : `${dateAux.getDay()}`;

    res=(dateAux.getMonth()>0 && dateAux.getMonth()<10) ? `${res}/0${dateAux.getMonth()}/` : `${res}/${dateAux.getMonth()}/`;

    res=`${res}${dateAux.getFullYear()}`;

    return res;
  }
}
