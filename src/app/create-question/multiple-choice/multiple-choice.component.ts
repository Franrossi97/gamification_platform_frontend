import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { Option } from 'src/app/shared/Option';
import { Question } from 'src/app/shared/Question';
import { Location } from '@angular/common';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {

  backIcon = faArrowLeft;
  newQuestionForm: UntypedFormGroup;
  newOptionsForm: UntypedFormGroup;
  valid = true;
  questionType: number;
  selectedOption: boolean;
  constructor(private fb: UntypedFormBuilder, private questionService: QuestionService,
    private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void
  {
    this.questionType=2;
    this.selectedOption=false;
    this.createFormQuestion();
    this.createFormOptions();
  }

  createFormQuestion()
  {
    this.newQuestionForm=this.fb.group(
    {
      question: new UntypedFormControl(null, [Validators.required]),
      difficult: new UntypedFormControl(false),
      time: new UntypedFormControl(30, [Validators.required, Validators.min(0)]),
      coins: new UntypedFormControl(0, [Validators.required, Validators.min(0)]),
      //score: new FormControl(null, [Validators.required]),
    })
  }

  createFormOptions()
  {
    this.newOptionsForm=this.fb.group(
    {
      option1: this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
      option2: this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
      option3:  this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
      option4:  this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
    }, {validator: this.sumScoreValidator});
  }

  sumScoreValidator(control: AbstractControl): { [key: string]: boolean } | null
  {
    const tot:number= control.get('option1.score').value + control.get('option2.score').value+
    control.get('option3.score').value + control.get('option4.score').value;

    return (tot==100) ? null : {checktot100:(true)};
  }

  onSubmitQuestion()
  {
    const newQuestion = this.createQuestion();
    console.log(newQuestion);

    this.questionService.createQuestion(this.route.snapshot.params.id, newQuestion).subscribe(res =>
    {
      this.newQuestionForm.reset();
      this.newOptionsForm.reset();
      this.location.back();
    }, err =>
    {
      console.log(err);
    });
  }

  createQuestion(): Question
  {
    const options=this.createOptions();
    const question=new Question(null, this.newQuestionForm.get('question').value,
    this.newQuestionForm.get('difficult').value, this.questionType/*,
    this.newQuestionForm.get('score').value*/, localStorage.getItem('userId'),
    this.newQuestionForm.get('time').value, this.newQuestionForm.get('coins').value, this.route.snapshot.params.id, options);
    return question;
  }

  createOptions(): Option[]
  {
    let options: Option[]=new Array();
    options.push(new Option(this.newOptionsForm.get('option1.text').value, this.newOptionsForm.get('option1.score').value, 0));
    options.push(new Option(this.newOptionsForm.get('option2.text').value, this.newOptionsForm.get('option2.score').value, 0));
    options.push(new Option(this.newOptionsForm.get('option3.text').value, this.newOptionsForm.get('option3.score').value, 0));
    options.push(new Option(this.newOptionsForm.get('option4.text').value, this.newOptionsForm.get('option4.score').value, 0));

    return options;
  }

  onBack() {
    this.location.back();
  }
}
