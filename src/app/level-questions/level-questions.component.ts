import { badgeInfo } from './../shared/BadgeInformation';
import { ConstantService } from './../services/constant.service';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { BadgeFactory } from './../shared/BadgeFactory';
import { BadgeTimer } from './../shared/BadgeTimer';
import { Badge } from './../shared/Badge';
import { UserService } from './../services/user.service';
import { LevelService } from './../services/level.service';
import { QuestionService } from './../services/question.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../shared/Question';
import { Option } from '../shared/Option';
import { BadgeQuestions } from '../shared/BadgeQuestion';
import { BadgeDate } from '../shared/BadgeDate';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const MAX_BADGES=4;
const MAX_BOOSTERS=4;

@Component({
  selector: 'app-level-questions',
  templateUrl: './level-questions.component.html',
  styleUrls: ['./level-questions.component.scss']
})
export class LevelQuestionsComponent implements OnInit
{
  @ViewChild("youWonABadge") modalWonBadge: TemplateRef<any>;

  coinsIcon=faCoins;
  COIND_ID: number;
  LEVEL_NAME='';
  SUBJECT_ID: number;
  LEVEL_ID: number;
  MAX_TIME=0;
  maxScore=0; //El valor se obtiene del componente nivel
  actualTime=0;
  questions: Question[];
  countQuestions;
  countAnsweredQuestions=0; //Cantidad de actual de preguntas visualizadas
  answeredQuestions: boolean[]; //Se utiliza para preguntar si una X pregunta fue visualizada
  followedAnsweredQuestions=0;
  actualQuestion=-1; //Index de la pregunta actual
  selection: Array<Array<boolean>>=new Array(2); //Contiene los vectores para cambiar el color de las opciones en caso de responder bien o mal
  //selectionWrong: boolean[]=new Array(4); //Se setea en false, si se selecciona la respuesta incorrecta pasa a true y cambia a rojo el botón de la opción
  //selectionRight: boolean[]=new Array(4); //Se setea en false, si se selecciona la respuesta correcta pasa a true y cambia a verde el botón de la opción
  optionDisabled: boolean[]=new Array(4); //Desabilita el click de las preguntas
  optionDisableColor: boolean[]=new Array(4);
  optionsToSelect; //Cantidad de opciones correctas que se pueden seleccionar
  //porcentajesPregunta: number[]=new Array(); //Se van a ir acumulando cada uno de los porcentajes obtenidos por cada pregunta para luego calcular el puntaje final
  porcentajesPregunta: Map<number, number>=new Map<number, number>();
  finalScore: number;
  countDownIndicator: number;
  lastDateAttempt: Date;
  disableBoosters=false;
  BOOSTER_PRICES: Array<number>=new Array<number>(MAX_BOOSTERS);
  anotherAttempt=false;
  settedInterval;
  availableBadges: any[]=new Array<any>(MAX_BADGES);
  wonBadgeIndex: number;
  showWonAlert=false;
  winBadges: Array<number> = new Array<number>(MAX_BADGES);
  extraBadgesScore=0;
  countTimer=0;
  availableCoins=0;
  updateCoins=false;
  PENALIZATAION=0;
  addPenalization=false;
  showCorrect=false;
  showIncorrect=false;

  constructor(private questionService: QuestionService, private route: ActivatedRoute,
    private levelService: LevelService, private router: Router,
    private userService: UserService, private constantService: ConstantService,
    private modalService: NgbModal) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.LEVEL_ID=params['id'];
      this.winBadges.fill(0);
      this.availableBadges.fill(null);
      this.getLevelName(this.LEVEL_ID);
      this.retrieveCountQuestions();
      this.retrieveMaxScore();
      this.retrieveSubjectId();
      this.getQuestions(this.LEVEL_ID); //Se cargan todas las preguntas junto con sus opciones
      this.getBadges(this.LEVEL_ID);
      this.getAvailableCoins();
      this.selection[0]=new Array(4);
      this.selection[1]=new Array(4);
      this.initializeBoosterPrices();

      if(this.countQuestions==undefined)
      {
        this.router.navigate(['home']);
      }
    });

  }

  getLevelName(idLevel: number)
  {
    this.levelService.getOneLevel(idLevel).subscribe(async res =>
    {
      this.LEVEL_NAME=res.descripcion;
      this.PENALIZATAION= await res.penalizacion;
      this.addPenalization=res.penalizacion>0;
    });
  }

  getAvailableCoins()
  {
    this.userService.getStudentCoins(this.SUBJECT_ID, +localStorage.getItem('userId')).subscribe((res: {id_moneda: number, cant_monedas:number}) =>
    {
      if(res)
      {
        this.COIND_ID= res.id_moneda;
        this.availableCoins=res.cant_monedas;
      }
    });
  }

  setTimer() //Manejo el timer
  {
    const starterTime=new Date().getTime();
    this.actualTime=0;
    this.settedInterval= setInterval(() =>
    {
      if (this.actualTime>= this.questions[this.actualQuestion].tiempo)
      {
        clearInterval(this.settedInterval);
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
      this.questions.forEach(item =>
      {
        this.questionService.getOptionsforQuestion(item.id_pregunta).subscribe(options =>
        {
          item.opciones=options;
        })
      });
    });

  }

  async getQuestiontoShow() //Con las preguntas cargadas se elige aleatoriamente la siguiente pregunta
  {
    this.countTimer+=this.floorTimer(this.actualTime); //Se utilizaran independientemente de si la insignia de preguntas está activa o no
    //this.disableBoosters=false;
    //let auxQuestion: number;
    this.countAnsweredQuestions++; //Se suma  1 al contador de preguntas respondidas
    this.anotherAttempt=false;

    if(this.countAnsweredQuestions<(this.countQuestions+1))
    {
      this.optionsToSelect=0; //Inicializo contador de opciones que deben ser seleccionadas
      this.selection[0].fill(false); //this.selectionRight.fill(false);
      this.selection[1].fill(false); //this.selectionWrong.fill(false);
      this.optionDisabled.fill(true);
      this.optionDisableColor.fill(false);
      const questionIndex=Math.floor(this.getRandomArbitrary(0, this.questions.length-1)); //Tomo un valor aleatorio dentro de un rango
      console.log(questionIndex);

      await this.setQuestionToShow(questionIndex);

      this.questions[this.actualQuestion].opciones.forEach(item => //Cuento la cantidad de opciones que se deberán marcar
      //this.questions[auxQuestion].opciones.forEach(item =>
      {
        if(item.porcentaje_puntaje>0)
          this.optionsToSelect++;
      });

      //this.countDown(3);

      clearInterval(this.settedInterval);
      this.setTimer(); //Inicializo el contador
      /*
      setTimeout(() =>
      {
        //this.actualQuestion=auxQuestion;

      }, 3000);
      */
      this.registerQuestionOnTable(this.questions[this.actualQuestion].id_nivel, +localStorage.getItem('userId'), this.questions[this.actualQuestion].id_pregunta); //Agrego la pregunta selccionada a la tabla respuesta_individual

    }
    else //No quedan más preguntas por responder
    {
      clearInterval(this.settedInterval);
      this.levelService.recieveLevelId(this.LEVEL_ID);
      this.registerBadgeTimer(); //Se utilizaran independientemente de si la insignia de preguntas está activa o no
      this.registerBadgeQuestions(); //Se utilizaran independientemente de si la insignia de preguntas está activa o no
      this.calculateFinalResult().then(score => //Se entrega el puntaje total, luego se exhibe en un modal
      {
        this.finalScore=score;

        setTimeout( () => {
          this.questionService.setFinishedQuestionnaire(localStorage.getItem('userId'), this.SUBJECT_ID, this.LEVEL_ID, this.finalScore).subscribe(res => {
          this.router.navigate(['result'], {relativeTo: this.route});

        }, err => {
          console.log(err);
        })},

        1500);
      });
    }

  }

  async setQuestionToShow(questionIndex: number)
  {
    if(!this.answeredQuestions[questionIndex]) //Si la pregunta no se usó se muestra directamente
    {
      //auxQuestion=questionIndex;
      this.actualQuestion=questionIndex;
      this.answeredQuestions[questionIndex]=true;/*
      console.log(this.answeredQuestions);
      console.log(this.questions[this.actualQuestion]);*/
    }
    else //Si la pregunta seleccionada ya fue usada, se busca la primera que no lo haya sido
    {
      var i=0;
      while(i < this.answeredQuestions.length && this.answeredQuestions[i])
      {
        i++;
      }

      if(i < this.answeredQuestions.length){
        this.answeredQuestions[i]=true;
        this.actualQuestion=i;
      }
      else{
        clearInterval(this.settedInterval);
      }
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
        this.selection[1][optionIndex]=true;
        //this.selectionRight[optionIndex]=true;
        this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'),
        this.questions[this.actualQuestion].id_pregunta, 100, this.lastDateAttempt);
        this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, 100);
        this.followedAnsweredQuestions+=1; //Se utilizaran independientemente de si la insignia de preguntas está activa o no
        this.showCorrect=true;
        if(this.updateCoins)
        {
          this.availableCoins+=this.questions[this.actualQuestion].recompensa;
          this.changeCoinsQuantity(this.COIND_ID, this.availableCoins);
        }
        this.selectNextQuestionWithDelay(2000);
      }
      else
      {
        if(!this.anotherAttempt)
        {
          this.selection[0][optionIndex]=true;
          //this.selectionWrong[optionIndex]=true;
          this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'),
          this.questions[this.actualQuestion].id_pregunta, 0, this.lastDateAttempt);
          this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, 0);
          this.showIncorrect=true;
          this.followedAnsweredQuestions=0;
          this.selectNextQuestionWithDelay(2000);
        }
        else
        {
          this.optionDisabled[optionIndex]=false;
          this.optionDisableColor[optionIndex]=true;
          this.anotherAttempt=false;
        }
        this.optionDisabled[optionIndex]=false;
      }
    }
    else
    {
      if(this.questions[this.actualQuestion].tipo_pregunta==2)
      {
        if(this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje>0) //Se verifica que la opción seleccionada sea correcta
        {
          this.selection[1][optionIndex]=true;
          //this.selectionRight[optionIndex]=true;
          this.optionDisabled[optionIndex]=false;
          this.optionsToSelect--;

          if(this.porcentajesPregunta.has(this.questions[this.actualQuestion].id_pregunta))
          {
            let aux=this.porcentajesPregunta.get(this.questions[this.actualQuestion].id_pregunta);
            this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje+aux);
          }
          else
          {
            this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje);
          }

          this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'),
            this.questions[this.actualQuestion].id_pregunta, this.porcentajesPregunta.get(this.questions[this.actualQuestion].id_pregunta)
            +this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje, this.lastDateAttempt);

          if(this.optionsToSelect<1)
          {
            this.followedAnsweredQuestions+=1;
            if(this.updateCoins)
            {
              this.availableCoins+=this.questions[this.actualQuestion].recompensa;
              this.changeCoinsQuantity(this.COIND_ID, this.availableCoins);
            }
            this.showCorrect=true;
            this.selectNextQuestionWithDelay(2000);
          }
        }
        else //Si se equivoca, se termina la pregunta
        {
          if(!this.anotherAttempt)
          {
            this.selection[0][optionIndex]=true;
            //this.selectionWrong[optionIndex]=true;
            this.optionDisabled.fill(false);
            this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'),
              this.questions[this.actualQuestion].id_pregunta, 0, this.lastDateAttempt);
            //this.porcentajesPregunta[this.actualQuestion]=0;
            this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, 0);
            //this.getQuestiontoShow();
            this.showIncorrect=true;
            this.selectNextQuestionWithDelay(2000);
          }
          else
          {
            this.optionDisableColor[optionIndex]=true;
            this.optionDisabled[optionIndex]=false;
            this.anotherAttempt=false;
          }
          this.followedAnsweredQuestions=0;
        }
      }
    }
  }

  registerBadgeTimer()
  {
    //let auxBadges: BadgeTimer=this.getBadgeOfType(1); //Timer badge
    let auxBadges: BadgeTimer=this.availableBadges[1], extraAux:number;
    if(auxBadges!=null)
    {
      this.wonBadgeIndex=1;
      extraAux=auxBadges.validBadge([this.countTimer, this.countQuestions]);
      this.extraBadgesScore+=extraAux;
      if(extraAux>0)
      {
        this.winBadges[this.wonBadgeIndex] = 1;
        this.updateValueBadgeLevel(this.LEVEL_ID, this.winBadges);
      }
    }
  }

  registerBadgeQuestions()
  {
    //let auxBadges: BadgeQuestions=this.getBadgeOfType(0); //Timer badge
    let auxBadges: BadgeQuestions=this.availableBadges[0], extraAux: number;

    if(auxBadges!=null)
    {
      this.wonBadgeIndex=0;
      extraAux=auxBadges.validBadge(this.followedAnsweredQuestions);
      this.extraBadgesScore+=extraAux;
      if(extraAux>0)
      {
        this.winBadges[this.wonBadgeIndex] = 1;
        this.updateValueBadgeLevel(this.LEVEL_ID, this.winBadges);
      }
    }
  }
/*
  defineTimerBadgeValue()
  {
    let badgeTimer: BadgeTimer= this.getBadgeOfType(1);

    if(badgeTimer.por_pregunta)
    {
      this.actualTime
    }
  }*/

  calculateFinalResult(): Promise<number> //Una vez que se ven todas la preguntas se calcula el puntaje final
  {
    var finalScore: number=0, scoreEachQuestion;
    scoreEachQuestion=this.maxScore/this.countQuestions;

    this.porcentajesPregunta.forEach((value, key) =>
    {
      console.log(`Pregunta:${key} || Porcentaje: ${value}`);

      finalScore+=(scoreEachQuestion*(value/100)); //Se suma cada uno de los porcentajes obtenidos de cada respuesta
    });

    if(this.addPenalization)
    {
      finalScore*=(1-(this.PENALIZATAION/100));
    }

    finalScore*=(1+(this.extraBadgesScore/100));

    //return this.PENALIZATAION<100 ? finalScore : 0;

    return new Promise((resolve, reject) =>
    {
      resolve(this.PENALIZATAION<100 ? finalScore : 0);
    });
  }

  retrieveMaxScore()
  {
    this.questionService.getMaxScore().subscribe(maxScore =>
    {
      this.maxScore=maxScore; //Seteo el puntaje máximo posible
    });
  }

  retrieveSubjectId()
  {
    this.levelService.getSubjectId().subscribe(id =>
    {
      this.SUBJECT_ID=id;
    })
  }

  retrieveCountQuestions()
  {
    this.levelService.getCountQuestions().subscribe(count =>
    {
      this.countQuestions=count;
      //console.log(count);
    });
  }

  registerQuestionOnTable(idLevel: number|string, idStudent: number|string, idQuestion: number|string)
  {
    this.questionService.addNewUsedQuestion(this.SUBJECT_ID, idLevel, idStudent, idQuestion).subscribe();
  }

  registerResultOnTable(idLevel: number|string, idStudent: number|string, idQuestion: number|string, result: number, lastAttemptDate: Date)
  {
    const dateToUse=`${lastAttemptDate.getFullYear()}-${lastAttemptDate.getMonth()}-${lastAttemptDate.getDate()} ${lastAttemptDate.getHours()}:${lastAttemptDate.getMinutes()}:${lastAttemptDate.getSeconds()}`;

    this.questionService.addNewAnswer(this.SUBJECT_ID, idLevel, idStudent, idQuestion, result, dateToUse).subscribe();
  }

  pendingQuestions(idStudent: number, idLevel: number|string)
  {
    this.questionService.getIndividualAttempts(idStudent, idLevel, this.SUBJECT_ID).subscribe((res: individualAnswer) =>
    {
      console.log(res);

      if(res== null || !!(res.finalizado))
      {
        if(res==null)
        {
          this.registerAttempt(idLevel, idStudent, 0);
          this.updateCoins=true;
        }
        else
        {
          this.PENALIZATAION*=res.intentos;
          console.log('penalización', this.PENALIZATAION, res.intentos);
          this.registerAttempt(idLevel, idStudent, res.intentos);
          this.disableBoosters=res.uso_booster;
        }
      }
      else
      {
        console.log('entro acá');
        this.loadBadgesScore(this.stringPadLeft(res.uso_insignias));
        this.getPendingQuestions(idStudent, idLevel, res.fecha_ultimo_intento);
        this.lastDateAttempt= new Date(res.fecha_ultimo_intento);
        this.disableBoosters=res.uso_booster;
      }

    });
  }

  registerAttempt(idLevel: number|string, idUser: number, intentos: number)
  {
    this.questionService.addNewAttempt(this.SUBJECT_ID, idLevel, idUser).subscribe(res =>
    {
      //console.log(res);
      this.getDateAttempt(idLevel, idUser);

      this.badgeRegisterAndGetQuestions(intentos);
    }, err =>
    {
      console.log(err);

    });
  }

  getDateAttempt(idLevel: number|string, idUser: number)
  {
    this.questionService.getIndividualAttempts(idUser, idLevel, this.SUBJECT_ID).subscribe((res: individualAnswer) =>
    {
      this.lastDateAttempt=new Date(res.fecha_ultimo_intento);
    },err =>
    {
      console.log(err);
    });
  }

  badgeRegisterAndGetQuestions(intentos: number)
  {
    this.registerBadgeAttempts(intentos);
    this.registerBadgeDate();

    this.getQuestiontoShow();
  }

  //Recorro el número binario que indica si en la sesión anterior ganó alguna insignia.
  loadBadgesScore(binaryBadges: string): void
  {
    let specifiedBadge: Badge;

    for(let i=0; i<MAX_BADGES; i++)
    {
      if(binaryBadges[i]=='1')
      {
        //specifiedBadge=this.getBadgeOfType(i);
        specifiedBadge=this.availableBadges[i];
        if(specifiedBadge)
        {
          console.log(`Insignia de intentos: ${this.extraBadgesScore}`);
          this.extraBadgesScore+=specifiedBadge.puntaje_extra;
          console.log(`Insignia de intentos: ${this.extraBadgesScore}`);
        }
      }
    }
  }

  stringPadLeft(binaryNumber: string): string
  {
    const concatString='';
    for(let i=0; i<(MAX_BADGES-binaryNumber.length); i++)
    {
      //concatString+='0';
      concatString.concat('0');
    }

    return concatString+binaryNumber;
  }

  registerBadgeAttempts(countAttempts: number)
  {
    //let auxBadges: BadgeAttempts=this.getBadgeOfType(3); //Attempts badge
    const auxBadges=this.availableBadges[3]
    let extraAux: number;
    console.log(auxBadges);

    if(auxBadges!=null)
    {
      this.wonBadgeIndex=3;
      extraAux=auxBadges.validBadge(countAttempts+1)
      this.extraBadgesScore+= extraAux;

      if(extraAux>0)
      {
        this.winBadges[this.wonBadgeIndex] = 1;
        this.updateValueBadgeLevel(this.LEVEL_ID, this.winBadges);
      }
    }
  }

  registerBadgeDate()
  {
    //let auxBadges: BadgeDate=this.getBadgeOfType(2); //Attempts badge
    let auxBadges: BadgeDate=this.availableBadges[2], extraAux: number;
    if(auxBadges!=null)
    {
      this.wonBadgeIndex=2;
      extraAux=auxBadges.validBadge(new Date());
      this.extraBadgesScore+=extraAux;
      if(extraAux>0)
      {
        this.winBadges[this.wonBadgeIndex] = 1;
        this.updateValueBadgeLevel(this.LEVEL_ID, this.winBadges);
      }
    }
  }

  getPendingQuestions(idStudent: number, idLevel: number|string, lastAttempt: Date)
  {
    const auxDate = new Date(lastAttempt);
    const dateForComparison =`${auxDate.getFullYear()}-${auxDate.getMonth()+1}-${auxDate.getDate()} ${auxDate.getHours()}:${auxDate.getMinutes()}:${auxDate.getSeconds()}`;
    console.log(dateForComparison);

    this.questionService.getQuestionsAfterDate(this.SUBJECT_ID, idStudent, idLevel, dateForComparison).subscribe((numberQuestions: questionsAnswered[])=>
    {
      console.log(numberQuestions);

      numberQuestions.forEach(questionId =>
      {
        let i=0;
        this.questions.every(question =>
        {
          i++;
          if(question.id_pregunta==questionId.id_pregunta)
          {
            this.answeredQuestions[i]=true;
            return false;
          }
        });

        this.porcentajesPregunta.set(questionId.id_pregunta, questionId.respuesta_correcta);
      });

      this.countAnsweredQuestions=numberQuestions.length;
      console.log('Preguntas ya respondidas '+this.countAnsweredQuestions);

      this.getQuestiontoShow();
    });
  }

  countDown(start: number)
  {
    this.countDownIndicator=start;

    setTimeout(() =>{}, 1000);

    const interval= setInterval(() =>
    {
      this.countDownIndicator--;
      if(this.countDownIndicator==0)
      {
        clearInterval(interval);
      }
    }, 1000);
  }

  selectNextQuestionWithDelay(time: number)
  {
    this.optionDisabled.fill(false);
    setTimeout(() =>
    {
      this.getQuestiontoShow();
      this.showCorrect=false;
      this.showIncorrect=false;
    }, time);
  }

  addMoreTime()
  {
    this.actualTime-=7;
  }

  addAnotherAttempt()
  {
    this.anotherAttempt=true;
  }

  deleteTwoOptions()
  {
    let loop:number=this.countCorrectOptions(this.questions[this.actualQuestion].opciones)>1 ? 1:2, optionIndex;

    //console.log(loop);

    for(let repeat=0;repeat<loop;repeat++)
    {
      optionIndex=Math.floor(this.getRandomArbitrary(0, 3));

      if(this.optionDisabled[optionIndex] && this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje==0)
      {
        this.optionDisabled[optionIndex]=false;
        this.optionDisableColor[optionIndex]=true;
      }
      else
      {
        let i=0;
        while(!this.optionDisabled[i] || this.questions[this.actualQuestion].opciones[i].porcentaje_puntaje!=0)
        {
          //console.log(i);
          i++
        }

        this.optionDisabled[i]=false;
        this.optionDisableColor[i]=true;
      }
    }
  }

  countCorrectOptions(options: Option[])
  {
    return options.filter(item =>
    {
      return (item.porcentaje_puntaje>0);
    }).length;
  }

  skipQuestion(idLevel: number|string, idQuestion: number|string, dateToCompare: Date)
  {
    console.log('salteo pregunta');

    const dateForComparison=`${dateToCompare.getFullYear}-${dateToCompare.getMonth}-${dateToCompare.getDate} ${dateToCompare.getHours}:${dateToCompare.getMinutes}:${dateToCompare.getSeconds}`;
    this.questionService.deleteAnswer(this.SUBJECT_ID, idLevel, localStorage.getItem('userId'), idQuestion, dateForComparison).subscribe(res =>
    {
      this.getQuestiontoShow();
    }, (err) =>
    {
      console.log(`No se pudo borrar la pregunta: ${err}`);
    })
  }

  useBooster(idBooster: number, idLevel: number|string, idQuestion: number|string, dateToCompare: Date)
  {
    if((this.availableCoins-this.BOOSTER_PRICES[idBooster]) > 0)
    {
      this.disableBoosters=true;
      //let boosters: Array<any>=this.setBoosterArray();

      console.log(idBooster);
      this.userService.setUsedBoosterOnLevel(this.SUBJECT_ID, idLevel, +localStorage.getItem('userId')).subscribe(res =>
      {
        switch(idBooster) {
          case 0: this.addMoreTime();
          break;
          case 1: this.addAnotherAttempt();
          break;
          case 2: this.deleteTwoOptions();
          break;
          case 3: this.skipQuestion(idLevel, idQuestion, dateToCompare);
        }

        this.availableCoins-=this.BOOSTER_PRICES[idBooster];
        this.changeCoinsQuantity(this.COIND_ID, (this.availableCoins-this.BOOSTER_PRICES[idBooster]));
      }, err =>
      {
        console.log(err);
      });
    }

  }

  changeCoinsQuantity(idCoin: number, coins: number)
  {
    this.userService.setCountCoins(idCoin, coins).subscribe(res =>
    {
      console.log(res);
    });
  }

  getBadges(idLevel: number|string)
  {
    const getRestDataFromBadge=(badge:badgeData) =>
    {
      return new Promise((res) =>
      {
        this.levelService.getBadgeSpecify(badge.id_insignia, badge.tipo_insignia).subscribe(specify =>
        {
          res(specify);
        })
      })
    }

    this.levelService.getBadges(idLevel).subscribe(async res =>
    {
      for(let i=0; i<res.length; i++)
      {
        res[i]=await getRestDataFromBadge(res[i]);
      }

      this.assignBadges(res);

      console.log(this.availableBadges);

      this.pendingQuestions(+localStorage.getItem('userId'), idLevel);
    }, err =>
    {
      console.log(err);

    });
  }

  assignBadges(badges: badgeData[])
  {

    badges.forEach(badge =>
    {
      this.availableBadges[badge.tipo_insignia]= BadgeFactory.getBadge(badge);
      console.log(this.availableBadges[badge.tipo_insignia]);

    });

  }

  getBadgeOfType(type: number)
  {
    let i: number=0, cont: boolean=true;

    for(i=0; i<this.availableBadges.length && cont;i++)
    {
      console.log(this.availableBadges[i].tipo_insignia==type);

      if(this.availableBadges[i].tipo_insignia==type)
        cont=false
    }
    /*
    this.availableBadges.every(badge =>
    {
      console.log(badge);

      if(badge.tipo_insignia==type)
      {
        return false;
      }
      console.log(i);

      i++;
    });*/

    console.log(this.availableBadges[i]);

    return i<this.availableBadges.length ? this.availableBadges[i] : null;
  }

  async updateValueBadgeLevel(idLevel: number|string, newValue: Array<number>)
  {
    //console.log(newValue, newValue.toString(2));

    //this.levelService.updateUsedBadges(idLevel, localStorage.getItem('userId'), (newValue >>> 0).toString(2)).subscribe(res =>
    await this.levelService.updateUsedBadges(this.SUBJECT_ID, idLevel, localStorage.getItem('userId'), newValue).subscribe(async res =>
    {
      await this.showWonBadgeAlert();
    },err =>
    {
      console.log(err);
    });
  }

  getBadgePic(indexBadge: number)
  {
    //return badgeInfo[indexBadge][0];
    return badgeInfo.get(indexBadge)[0];
  }

  getBadgeDetails(indexBadge: number)
  {
    //return badgeInfo[indexBadge][1];
    return badgeInfo.get(indexBadge)[1];
  }

  async showWonBadgeAlert()
  {
    this.showWonAlert=true;
    this.modalService.open(this.modalWonBadge)
    clearInterval(this.settedInterval);
    await new Promise((resolve) => {
        setTimeout(() => {
            // Resolve the promise
            this.modalService.dismissAll();
            //resolve(console.log('hello'));
            this.setTimer();
        }, 3000);
    });
  }

  initializeBoosterPrices()
  {
    this.constantService.getBoosterPrices().subscribe(prices =>
    {
      let i=0;
      //console.log(prices);

      prices.forEach(price =>
      {
        this.BOOSTER_PRICES[i++]=price.content;
      });
    });
    //console.log(this.BOOSTER_PRICES);
  }

  ngOnDestroy(): void {
    clearInterval(this.settedInterval);
  }

}

interface individualAnswer
{
  intentos: number,
  uso_booster: boolean,
  uso_insignias: string;
  finalizado: boolean,
  fecha_ultimo_intento: Date,
}

interface questionsAnswered
{
  id_pregunta: number,
  respuesta_correcta: number,
}

interface badgeData
{
  descripcion?: string,
  hasta_dia?: Date,
  id_insignia: number,
  puntaje_extra: number,
  tipo_insignia: number,
  titulo?: string,
  intentos_maximos?: number,
}
