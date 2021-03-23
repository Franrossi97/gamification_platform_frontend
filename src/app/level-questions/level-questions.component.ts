import { LevelService } from './../services/level.service';
import { QuestionService } from './../services/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../shared/Question';

@Component({
  selector: 'app-level-questions',
  templateUrl: './level-questions.component.html',
  styleUrls: ['./level-questions.component.scss']
})
export class LevelQuestionsComponent implements OnInit
{
  maxScore: number=0; //El valor se obtiene del componente nivel
  maxTime: number=30; //Tiempo máximo de cada pregunta
  actualTime: number;
  questions: Question[];
  numberAnsweredQuestions: number=0; //Cantidad de actual de preguntas visualizadas
  answeredQuestions: boolean[]; //Se utiliza para preguntar si una X pregunta fue visualizada
  actualQuestion: number; //Index de la pregunta actual
  selectionWrong: boolean[]=new Array(4); //Se setea en false, si se selecciona la respuesta incorrecta pasa a true y cambia a rojo el botón de la opción
  selectionRight: boolean[]=new Array(4); //Se setea en false, si se selecciona la respuesta correcta pasa a true y cambia a verde el botón de la opción
  optionsToSelect: number; //Cantidad de opciones correctas que se pueden seleccionar
  porcentajesPregunta: number[]=new Array(); //Se van a ir acumulando cada uno de los porcentajes obtenidos por cada pregunta para luego calcular el puntaje final
  finalScore: number;

  constructor(private questionService: QuestionService, private route: ActivatedRoute, private levelService: LevelService) { }

  ngOnInit(): void
  {
    this.setTimer();

    this.questionService.getMaxScore().subscribe(maxScore =>
    {
      this.maxScore=maxScore; //Seteo el puntaje máximo posible
    });

    this.route.params.subscribe(params =>
    {
      this.getQuestions(params['id']); //Se cargan todas las preguntas junto con sus opciones
      this.registerAttempt(params['id'], +localStorage.getItem('userId'));

    });

    this.porcentajesPregunta.fill(0);
  }

  setTimer() //Manejo el timer
  {
    var starterTime=new Date().getTime();
    this.actualTime=0;
    const interval= setInterval(() =>
    {
      if (this.actualTime>=this.maxTime)
      {
        console.log('fin');
        clearInterval(interval);
        this.getQuestiontoShow();
      }
      else
      {
        if(document.hasFocus()) //Si se cambia de pestaña se va por el false. Es necesario para que el reloj no se detenga
        {
          this.actualTime+=0.01;
        }
        else
          this.actualTime=((new Date().getTime())-starterTime)/1000;

      }
    }, 10);
  }

  floorTimer(time: number)
  {
    return Math.floor(time);
  }

  getQuestions(idLevel: number|string) //Se cargan de la base de datos las preguntas
  {
    this.questionService.getQuestions(idLevel).subscribe(questions =>
    {
      console.log(questions);

      this.questions=questions;

      this.answeredQuestions=new Array(this.questions.length);
      this.answeredQuestions.fill(false);
      var i: number=0
      this.questions.forEach(item =>
      {
        console.log(item);
        this.questionService.getOptionsforQuestion(item.id_pregunta).subscribe(options =>
        {
          item.opciones=options;
          console.log(i);
          if((++i)==this.questions.length)
          {
            console.log(i);
            this.getQuestiontoShow();
            console.log('aca llamo');
          }
        })
      });
    });

  }

  getQuestiontoShow() //Con las preguntas cargadas se elige aleatoriamente la siguiente pregunta
  {
    this.numberAnsweredQuestions++; //Se suma  1 al contador de preguntas respondidas
    console.log(this.questions);
    console.log(this.questions.length);
    if(this.numberAnsweredQuestions==this.questions.length)
    {
      this.optionsToSelect=0; //Inicializo contador de opciones que deben ser seleccionadas
      this.selectionRight.fill(false);
      this.selectionWrong.fill(false);
      let questionIndex: number=this.getRandomArbitrary(0, this.questions.length-1); //Tomo un valor aleatorio dentro de un rango
      if(!this.answeredQuestions[questionIndex]) //Si la pregunta no se usó se muestra directamente
      {
        this.actualQuestion=questionIndex;
      }
      else //Si la pregunta seleccionada ya fue usada, se busca la primera que no lo haya sido
      {
        var i=0;
        this.answeredQuestions.every(item =>
        {
          if(!item)
          {
            item=true;
            this.actualQuestion=i;
            i++;
            return false;
          }
        });
      }

      this.questions[this.actualQuestion].opciones.forEach(item => //Cuento la cantidad de opciones que se deberán marcar
      {
        if(item.porcentaje_puntaje>0)
          this.optionsToSelect++;
      });

      this.setTimer(); //Inicializo el contador
    }
    else //No quedan más preguntas por responder
    {
      this.finalScore= this.calculateFinalResult(); //Se entrega el puntaje total, luego se exhibe en un modal
    }

  }

  getRandomArbitrary(min, max)
  {
    return Math.random() * (max - min) + min;
  }

  onSelectAnswer(optionIndex: number) //Al seleccionar una de la opciones
  {
    if(this.questions[this.actualQuestion].tipo_pregunta==1) //Se chequea el tipo de pregunta
    {
      if(this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje>0) //Se verifica que la opción seleccionada sea correcta
      {
        this.selectionRight[optionIndex]=true;
      }
      else
      {
        this.selectionWrong[optionIndex]=true;
      }
      this.getQuestiontoShow(); //Se pasa a la siguiente pregunta
    }
    else
    {
      if(this.questions[this.actualQuestion].tipo_pregunta==2)
      {
        if(this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje>0) //Se verifica que la opción seleccionada sea correcta
        {
          this.selectionRight[optionIndex]=true;
          this.optionsToSelect--;
          this.porcentajesPregunta[this.actualQuestion]=this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje;
          if(this.optionsToSelect==0)
            this.getQuestiontoShow();
        }
        else //Si se equivoca, se termina la pregunta
        {
          this.selectionWrong[optionIndex]=true;
          this.getQuestiontoShow();
        }
      }
    }
  }

  calculateFinalResult() //Una vez que se ven todas la preguntas se calcula el puntaje final
  {
    var i: number=0;
    var porcentajeSum: number=0;
    this.porcentajesPregunta.forEach(item =>
    {
      porcentajeSum+=this.questions[i].porcentaje_pregunta*(item/100); //Se suma cada uno de los porcentajes obtenidos de cada respuesta
    });

    return this.maxScore*porcentajeSum;
  }

  registerAttempt(idLevel: number, idUser: number)
  {
    this.levelService.addNewAttempt(idLevel, idUser).subscribe(res =>
    {
      console.log(res);
    }, err =>
    {
      console.log(err);

    });
  }
}
