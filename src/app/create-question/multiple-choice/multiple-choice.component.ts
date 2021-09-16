import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { Option } from 'src/app/shared/Option';
import { Question } from 'src/app/shared/Question';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {

  newQuestionForm: FormGroup;
  newOptionsForm: FormGroup;
  valid:boolean=true;
  questionType:number;
  selectedOption:boolean;
  constructor(private fb: FormBuilder, private questionService: QuestionService, private route: ActivatedRoute, private router: Router) { }

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
      question: new FormControl(null, [Validators.required]),
      difficult: new FormControl(false),
      time: new FormControl(30, [Validators.required, Validators.min(0)]),
      coins: new FormControl(0, [Validators.required, Validators.min(0)]),
      //score: new FormControl(null, [Validators.required]),
    })
  }

  createFormOptions()
  {
    this.newOptionsForm=this.fb.group(
    {
      option1: this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
      option2: this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
      option3:  this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(0, [Validators.min(0), Validators.max(100)]),
      }),
      option4:  this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(0, [Validators.min(0), Validators.max(100)]),
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
    let newQuestion:Question;
    newQuestion=this.createQuestion();
    console.log(newQuestion);

    this.questionService.createQuestion(this.route.snapshot.params.id, newQuestion).subscribe(res =>
    {
      this.newQuestionForm.reset();
      this.newOptionsForm.reset();
      this.router.navigate(['level', this.route.snapshot.params.id, 'question', 'create', 'select']);
    }, err =>
    {
      console.log(err);
    });
  }

  createQuestion(): Question
  {
    let options=this.createOptions();
    let question=new Question(null, this.newQuestionForm.get('question').value,
    this.newQuestionForm.get('difficult').value, this.questionType/*,
    this.newQuestionForm.get('score').value*/, localStorage.getItem('userId'),
    this.newOptionsForm.get('time').value, this.newOptionsForm.get('coins').value, this.route.snapshot.params.id, options);
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

}
