import { Location } from '@angular/common';
import { Question } from 'src/app/shared/Question';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { LevelService } from './../../../../services/level.service';
import { Option } from 'src/app/shared/Option';
import { Level } from 'src/app/shared/Level';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { faPen, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {

  editIcon = faPen;
  backIcon = faArrowLeft;
  XIcon = faTimes;
  editQuestionForm: UntypedFormGroup=null;
  editFeaturesForm: UntypedFormGroup=null;
  editingLevel: Level;
  editedLevelIndex = -1;
  editingQuestion: Question=null;
  indexEditingOption: number;
  editingOption: Option;
  editedAnswer: Array<Option>=new Array<Option>();
  disableAddButtons: Array<boolean>=new Array<boolean>(4);
  disableButtonLoadChange = true;
  showErrorMessage = false;
  errorMessage: string;

  constructor(private levelService: LevelService, private questionService: QuestionService, private route: ActivatedRoute,
    private fb: UntypedFormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param =>
    {
      //this.getLevelToEdit(+param.get('id_level'));

      this.getQuestions(+param.get('id_question'));

      this.editingOption = null;

      this.editedAnswer.length = 0;

      this.disableAddButtons.fill(false);
    });
  }

  getQuestions(idQuestion: number) {
    this.questionService.getQuestion(idQuestion).subscribe(res => {
      this.editingQuestion = res;

      this.createEditFeaturesForm();
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

  createEditAnswerForm()
  {
    this.editQuestionForm=this.fb.group(
    {
      answer: new UntypedFormControl('', Validators.required),
    });

    //this.editQuestionForm.controls['answer'].disable();
  }

  createEditFeaturesForm()
  {
    this.editFeaturesForm=this.fb.group(
    {
      time: new UntypedFormControl(this.editingQuestion.tiempo, [Validators.required, Validators.min(0)]),
      coins: new UntypedFormControl(this.editingQuestion.recompensa, [Validators.required, Validators.min(0)]),
    });
  }

  onEditFeatures()
  {
    const editedFeatures: Question=new Question(0, null, undefined, null, null,
      this.editFeaturesForm.get('time').value, this.editFeaturesForm.get('coins').value, null, null);

    this.questionService.editQuestion(this.editingQuestion.id_pregunta, editedFeatures).subscribe(res =>
    {
      console.log('All Good');
    },err =>
    {
      this.setErrorMessage('No se puedo modificar los valores de la pregunta.')
    });
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
      this.editingQuestion = null;
      this.editingOption = null;
      this.editedLevelIndex = -1;
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

}
