import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { QuestionService } from './../services/question.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Question } from '../shared/Question';
import { Option } from '../shared/Option';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit
{
  backIcon = faArrowLeft;
  newQuestionForm: UntypedFormGroup;
  newOptionsForm: UntypedFormGroup;
  //valid:boolean=true;
  questionType:number;
  selectedOption:boolean;
  checkboxControl: boolean[]=[false, false, false, false];
  constructor(private fb: UntypedFormBuilder, private questionService: QuestionService,
    private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit(): void
  {
    this.selectedOption=false;
    this.createFormQuestion();
    this.createFormOptions();
    this.onChangeOptions();
    this.questionType=1
    //console.log(this.route);

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
        score: new UntypedFormControl(false),
      }),
      option2: this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(false),
      }),
      option3:  this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(false),
      }),
      option4:  this.fb.group(
      {
        text: new UntypedFormControl(null, [Validators.required]),
        score: new UntypedFormControl(false),
      }),
    });
  }

  onChangeOptions()
  {
    this.newOptionsForm.valueChanges.subscribe(changes =>
    {
      //this.newOptionsForm.get('checks.option1');

      if(changes.option1.score) //Con estas verificaciones se bloquean los otros checkbox.
      {
        this.disableCheckbox(1);
      }
      else
        if(changes.option2.score)
        {
          this.disableCheckbox(2);
        }
        else
          if(changes.option3.score)
          {
            this.disableCheckbox(3);
          }
          else
            if(changes.option4.score)
            {
              this.disableCheckbox(4);
            }
            else
            {
              this.enableCheckbox();
            }
    });
  }

  disableCheckbox(except: number)
  {
    const N=4;
    let i=0;

    except--;
    for(i;i<N;i++)
    {
      if(i!=except)
      {
        this.checkboxControl[i]=true;
      }
    }
    console.log(this.checkboxControl);
  }

  enableCheckbox()
  {
    this.checkboxControl.fill(false);
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
    },error =>
    {
      console.log(error);
    });
  }

  createQuestion(): Question
  {
    const options=this.createOptions();
    const question=new Question(null, this.newQuestionForm.get('question').value,
    this.newQuestionForm.get('difficult').value, this.questionType,/*
    this.newQuestionForm.get('score').value,*/ localStorage.getItem('userId'),
    this.newQuestionForm.get('time').value, this.newQuestionForm.get('coins').value, this.route.snapshot.params.id, options);
    return question;
  }

  createOptions(): Option[]
  {
    const options: Array<Option> = new Array<Option>();
    options.push(new Option(this.newOptionsForm.get('option1.text').value, !this.checkboxControl[0] ? 100 : 0, 0));
    options.push(new Option(this.newOptionsForm.get('option2.text').value, !this.checkboxControl[1] ? 100 : 0, 0));
    options.push(new Option(this.newOptionsForm.get('option3.text').value, !this.checkboxControl[2] ? 100 : 0, 0));
    options.push(new Option(this.newOptionsForm.get('option4.text').value, !this.checkboxControl[3] ? 100 : 0, 0));

    return options;
  }

  isCheckBoxSelected() {
    let cont = 0;

    this.checkboxControl.forEach(control => {
      if(control == true) {
        cont++;
      }
    });

    return cont == 3;
  }

  onBack() {
    this.location.back();
  }

}
