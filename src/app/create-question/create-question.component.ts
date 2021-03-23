import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { QuestionService } from './../services/question.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
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

  newQuestionForm: FormGroup;
  newOptionsForm: FormGroup;
  valid:boolean=true;
  questionType:number;
  selectedOption:boolean;
  checkboxControl: boolean[]=[false, false, false, false];
  constructor(private fb: FormBuilder, private questionService: QuestionService, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.selectedOption=false;
    this.createFormQuestion();
    this.createFormOptions();
    this.onChangeOptions();
    this.questionType=1
  }

  createFormQuestion()
  {
    this.newQuestionForm=this.fb.group(
    {
      question: new FormControl(null, [Validators.required]),
      difficult: new FormControl(false),
      score: new FormControl(null, [Validators.required]),
    })
  }

  createFormOptions()
  {
    this.newOptionsForm=this.fb.group(
    {
      option1: this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(false),
      }),
      option2: this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(false),
      }),
      option3:  this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(false),
      }),
      option4:  this.fb.group(
      {
        text: new FormControl(null, [Validators.required]),
        score: new FormControl(false),
      }),
    });
  }

  onChangeOptions()
  {
    this.newOptionsForm.valueChanges.subscribe(changes =>
    {
      console.log(changes);
      if(this.questionType==1)
      {
        //this.newOptionsForm.get('checks.option1');

        if(changes.option1.score) //Con estas verificaciones se bloquean los otros checkbox.
        {
          this.disableCheckbox(1);
          console.log(1);
        }
        else
          if(changes.option2.score)
          {
            this.disableCheckbox(2);
            console.log(2);
          }
          else
            if(changes.option3.score)
            {
              this.disableCheckbox(3);
              console.log(3);
            }
            else
              if(changes.option4.score)
              {
                this.disableCheckbox(4);
                console.log(4);
              }
              else
              {
                this.enableCheckbox();
              }

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
    const N=4;
    let i=0;
    for(i;i<N;i++)
    {
      this.checkboxControl[i]=false;
    }
  }

  onSubmitQuestion()
  {
    let newQuestion:Question;
    newQuestion=this.createQuestion();
    console.log(newQuestion);

    this.questionService.createQuestion(this.route.snapshot.params.id, newQuestion).subscribe(res =>
    {
      console.log(res);

    },error =>
    {
      console.log(error);
    });
  }

  createQuestion(): Question
  {
    localStorage.getItem('userId')
    let options=this.createOptions();
    let question=new Question(null, this.newQuestionForm.get('question').value,
    this.newQuestionForm.get('difficult').value, this.questionType,
    this.newQuestionForm.get('score').value, null, this.route.snapshot.params.id, options);
    return question;
  }

  createOptions(): Option[]
  {
    let options: Option[]=new Array();
    options.push(new Option(this.newOptionsForm.get('option1.text').value, !this.checkboxControl[0] ? 100 : 0, 0));
    options.push(new Option(this.newOptionsForm.get('option2.text').value, !this.checkboxControl[1] ? 100 : 0, 0));
    options.push(new Option(this.newOptionsForm.get('option3.text').value, !this.checkboxControl[2] ? 100 : 0, 0));
    options.push(new Option(this.newOptionsForm.get('option4.text').value, !this.checkboxControl[3] ? 100 : 0, 0));

    return options;
  }

}
