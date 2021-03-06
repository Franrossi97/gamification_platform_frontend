import { badgeInfo } from './../shared/BadgeInformation';
import { ConstantService } from './../services/constant.service';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { BadgeFactory } from './../shared/BadgeFactory';
import { BadgeAttempts } from './../shared/BadgeAttempts';
import { BadgeTimer } from './../shared/BadgeTimer';
import { Badge } from './../shared/Badge';
import { UserService } from './../services/user.service';
import { QuestionResultService } from './../services/question-result.service';
import { LevelService } from './../services/level.service';
import { QuestionService } from './../services/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../shared/Question';
import { Option } from '../shared/Option';
import { BadgeQuestions } from '../shared/BadgeQuestion';
import { BadgeDate } from '../shared/BadgeDate';
const MAX_BADGES: number=4;
const MAX_BOOSTERS: number=4;

@Component({
  selector: 'app-level-questions',
  templateUrl: './level-questions.component.html',
  styleUrls: ['./level-questions.component.scss']
})
export class LevelQuestionsComponent implements OnInit
{
  coinsIcon=faCoins;
  LEVEL_NAME: string='';
  SUBJECT_ID: number;
  //COINS_PER_QUESTION: number=50;
  //MAX_TIME: number=30; //Tiempo máximo de cada pregunta
  LEVEL_ID: number;
  maxScore: number=0; //El valor se obtiene del componente nivel
  actualTime: number=0;
  questions: Question[];
  countQuestions: number;
  countAnsweredQuestions: number=0; //Cantidad de actual de preguntas visualizadas
  answeredQuestions: boolean[]; //Se utiliza para preguntar si una X pregunta fue visualizada
  followedAnsweredQuestions: number=0;
  actualQuestion: number=-1; //Index de la pregunta actual
  selection: Array<Array<boolean>>=new Array(2); //Contiene los vectores para cambiar el color de las opciones en caso de responder bien o mal
  //selectionWrong: boolean[]=new Array(4); //Se setea en false, si se selecciona la respuesta incorrecta pasa a true y cambia a rojo el botón de la opción
  //selectionRight: boolean[]=new Array(4); //Se setea en false, si se selecciona la respuesta correcta pasa a true y cambia a verde el botón de la opción
  optionDisabled: boolean[]=new Array(4); //Desabilita el click de las preguntas
  optionDisableColor: boolean[]=new Array(4);
  optionsToSelect: number; //Cantidad de opciones correctas que se pueden seleccionar
  //porcentajesPregunta: number[]=new Array(); //Se van a ir acumulando cada uno de los porcentajes obtenidos por cada pregunta para luego calcular el puntaje final
  porcentajesPregunta: Map<number, number>=new Map<number, number>();
  finalScore: number;
  countDownIndicator: number;
  lastDateAttempt: Date;
  disableBoosters: boolean=false;
  BOOSTER_PRICES: Array<number>=new Array<number>(MAX_BOOSTERS);
  anotherAttempt: boolean=false;
  settedInterval;
  availableBadges: any[]=new Array<any>(MAX_BADGES);
  wonBadgeIndex: number;
  showWonAlert: boolean=false;
  //percentageBadges: number[];
  winBadges: number=0; //Binario
  extraBadgesScore: number=0;
  countTimer: number=0;
  availableCoins=0;

  constructor(private questionService: QuestionService, private route: ActivatedRoute,
    private levelService: LevelService, private router: Router,
    private questionResultService: QuestionResultService, private userService: UserService,
    private constantService: ConstantService) { }

  ngOnInit(): void
  {/*
    this.route.params.subscribe(params =>
    {
      this.LEVEL_ID=params['id'];
      this.getLevelName(this.LEVEL_ID);
      this.retrieveCountQuestions();
      this.retrieveMaxScore();
      this.retrieveSubjectId();
      this.getQuestions(this.LEVEL_ID); //Se cargan todas las preguntas junto con sus opciones
      this.userService.getStudentCoins(this.SUBJECT_ID, +localStorage.getItem('userId'));
      this.selection[0]=new Array(4);
      this.selection[1]=new Array(4);
      //this.percentageBadges.fill(0);
      if(this.countQuestions==undefined)
      {
        this.router.navigate(['home']);

      }
      //this.porcentajesPregunta.fill(0);
    });*/

  }

  getLevelName(idLevel: number)
  {
    this.levelService.getOneLevel(idLevel).subscribe(res =>
    {
      this.LEVEL_NAME=res.descripcion;
    });
  }

  setTimer() //Manejo el timer
  {
    var starterTime=new Date().getTime();
    this.actualTime=0;
    this.settedInterval= setInterval(() =>
    {
      //if (this.actualTime>= this.MAX_TIME)
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

      this.getBadges(idLevel);
    });

  }

  getQuestiontoShow() //Con las preguntas cargadas se elige aleatoriamente la siguiente pregunta
  {
    this.countTimer+=this.floorTimer(this.actualTime); //Se utilizaran independientemente de si la insignia de preguntas está activa o no
    this.disableBoosters=false;
    let auxQuestion: number;
    //this.actualQuestion=null;
    this.countAnsweredQuestions++; //Se suma  1 al contador de preguntas respondidas
    this.anotherAttempt=false;

    if(this.countAnsweredQuestions<(this.countQuestions+1))
    {
      this.optionsToSelect=0; //Inicializo contador de opciones que deben ser seleccionadas
      this.selection[0].fill(false);
      this.selection[1].fill(false);
      //this.selectionRight.fill(false);
      //this.selectionWrong.fill(false);
      this.optionDisabled.fill(true);
      this.optionDisableColor.fill(false);
      let questionIndex: number=Math.floor(this.getRandomArbitrary(0, this.questions.length-1)); //Tomo un valor aleatorio dentro de un rango
      console.log(questionIndex);
      if(!this.answeredQuestions[questionIndex]) //Si la pregunta no se usó se muestra directamente
      {
        //auxQuestion=questionIndex;
        this.actualQuestion=questionIndex;
        this.answeredQuestions[questionIndex]=true;
        console.log(this.answeredQuestions);
        console.log(this.questions[this.actualQuestion]);
      }
      else //Si la pregunta seleccionada ya fue usada, se busca la primera que no lo haya sido
      {
        var i=0;
        this.answeredQuestions.every(item =>
        {
          console.log(item);

          if(!item)
          {
            console.log('entro');

            this.answeredQuestions[i]=true;
            this.actualQuestion=i;
            return false;
          }

          i++;
        });
      }

      while(this.questions[this.actualQuestion].opciones==undefined)
      {
        true;
      }

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
      this.registerBadgeTimer(); //Se utilizaran independientemente de si la insignia de preguntas está activa o no
      this.registerBadgeQuestions(); //Se utilizaran independientemente de si la insignia de preguntas está activa o no
      this.finalScore= this.calculateFinalResult(); //Se entrega el puntaje total, luego se exhibe en un modal
      this.questionService.setFinishedQuestionnaire(localStorage.getItem('userId'), this.SUBJECT_ID, this.route.snapshot.paramMap.get('id'), this.finalScore).subscribe(res =>
      {
        console.log(res);

        this.questionResultService.recieveFinalScore(this.finalScore);
        this.router.navigate(['result'], {relativeTo: this.route});

      }, err =>
      {
        console.log(err);
      });
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
        this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'), this.questions[this.actualQuestion].id_pregunta, 100, this.lastDateAttempt);
        this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, 100);
        this.followedAnsweredQuestions+=0; //Se utilizaran independientemente de si la insignia de preguntas está activa o no
      }
      else
      {
        if(!this.anotherAttempt)
        {
          this.selection[0][optionIndex]=true;
          //this.selectionWrong[optionIndex]=true;
          //this.availableCoins+=this.COINS_PER_QUESTION;
          this.availableCoins+=this.questions[this.actualQuestion].recompensa;
          this.changeCoinsQuantity(this.SUBJECT_ID, +localStorage.getItem('userId'), this.availableCoins);
          this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'), this.questions[this.actualQuestion].id_pregunta, 0, this.lastDateAttempt);
          this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, 0);
        }
        else
        {
          this.optionDisabled[optionIndex]=false;
          this.optionDisableColor[optionIndex]=true;
          this.anotherAttempt=false;
        }
        this.followedAnsweredQuestions=0;
      }
      this.anotherAttempt ? null : this.optionDisabled.fill(false);
      //this.getQuestiontoShow(); //Se pasa a la siguiente pregunta
      this.selectNextQuestionWithDelay(2000);
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

          this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'),
            this.questions[this.actualQuestion].id_pregunta, this.porcentajesPregunta[this.actualQuestion]
            +this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje, this.lastDateAttempt);

          if(this.porcentajesPregunta.has(this.questions[this.actualQuestion].id_pregunta))
          {
            let aux=this.porcentajesPregunta.get(this.questions[this.actualQuestion].id_pregunta);
            this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje+aux);
          }
          else
          {
            this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje);
          }
          if(this.optionsToSelect==0)
          {
            this.followedAnsweredQuestions+=1;
            //this.getQuestiontoShow();
            //this.availableCoins+=this.COINS_PER_QUESTION;
            this.availableCoins+=this.questions[this.actualQuestion].recompensa;
            this.changeCoinsQuantity(this.SUBJECT_ID, +localStorage.getItem('userId'), this.availableCoins);
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
            this.registerResultOnTable(this.questions[this.actualQuestion].id_nivel, localStorage.getItem('userId'), this.questions[this.actualQuestion].id_pregunta, 0, this.lastDateAttempt);
            //this.porcentajesPregunta[this.actualQuestion]=0;
            this.porcentajesPregunta.set(this.questions[this.actualQuestion].id_pregunta, 0);
            //this.getQuestiontoShow();
            this.selectNextQuestionWithDelay(2000);
          }
          else
          {
            this.optionDisabled[optionIndex]=false;
            this.anotherAttempt=false;
            this.followedAnsweredQuestions=0;
          }
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
        this.winBadges+=4;
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
      extraAux=auxBadges.validBadge(this.countTimer);
      this.extraBadgesScore+=extraAux;
      if(extraAux>0)
      {
        this.winBadges+=8;
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

  calculateFinalResult() //Una vez que se ven todas la preguntas se calcula el puntaje final
  {
    var finalScore: number=0, scoreEachQuestion, i;
    scoreEachQuestion=this.maxScore/this.countQuestions;

    this.porcentajesPregunta.forEach((value, key) =>
    {
      console.log(`Pregunta:${key} || Porcentaje: ${value}`);

      finalScore+=(scoreEachQuestion*(value/100)); //Se suma cada uno de los porcentajes obtenidos de cada respuesta

      //finalScore+=this.calculateFinalResultBadges();
    });

    finalScore*=(1+(this.extraBadgesScore/100));

    return finalScore;
  }

  registerAttempt(idLevel: number|string, idUser: number, intentos: number)
  {
    this.questionService.addNewAttempt(this.SUBJECT_ID, idLevel, idUser).subscribe(res =>
    {
      console.log(res);
      this.getDateAttempt(idLevel, idUser);

      this.badgeRegisterAndGetQuestions(intentos)
    }, err =>
    {
      console.log(err);

    });
  }

  badgeRegisterAndGetQuestions(intentos: number)
  {
    this.registerBadgeAttempts(intentos);
    this.registerBadgeDate();

    console.log('registrado');
    this.getQuestiontoShow();
  }

  getDateAttempt(idLevel: number|string, idUser: number)
  {
    this.questionService.getIndividualAttempts(idUser, idLevel, this.SUBJECT_ID).subscribe((res: individualAnswer) =>
    {
      //this.lastDateAttempt=res.fecha_ultimo_intento;
      this.lastDateAttempt=new Date(res.fecha_ultimo_intento);
      console.log(this.lastDateAttempt);

    },err =>
    {
      console.log(err);
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
      console.log(count);
    });
  }

  registerQuestionOnTable(idLevel: number|string, idStudent: number|string, idQuestion: number|string)
  {
    this.questionService.addNewUsedQuestion(this.SUBJECT_ID, idLevel, idStudent, idQuestion).subscribe();
  }

  registerResultOnTable(idLevel: number|string, idStudent: number|string, idQuestion: number|string, result: number, lastAttemptDate: Date)
  {
    let dateToUse:string=`${lastAttemptDate.getFullYear()}-${lastAttemptDate.getMonth()}-${lastAttemptDate.getDate()} ${lastAttemptDate.getHours()}:${lastAttemptDate.getMinutes()}:${lastAttemptDate.getSeconds()}`;

    console.log(dateToUse);

    this.questionService.addNewAnswer(this.SUBJECT_ID, idLevel, idStudent, idQuestion, result, dateToUse).subscribe();
  }

  pendingQuestions(idStudent: number, idLevel: number|string)
  {
    console.log('preguntas pendientes');
    this.questionService.getIndividualAttempts(idStudent, idLevel, this.SUBJECT_ID).subscribe((res: individualAnswer) =>
    {
      console.log(res);

      if(res== null || res.finalizado)
      {
        (res == null)? this.registerAttempt(idLevel, idStudent, 0) : this.registerAttempt(idLevel, idStudent, res.intentos);
      }
      else
      {
        this.loadBadgesScore(this.stringPadLeft(res.uso_insignias));
        this.getPendingQuestions(idStudent, idLevel, res.fecha_ultimo_intento);
        this.lastDateAttempt= new Date(res.fecha_ultimo_intento);
        console.log(this.lastDateAttempt);
        this.disableBoosters=res.uso_booster;
      }

    });
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
    let concatString: string='';
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
    let auxBadges: BadgeAttempts=this.availableBadges[3], extraAux: number;
    console.log(auxBadges);

    if(auxBadges!=null)
    {
      this.wonBadgeIndex=3;
      extraAux=auxBadges.validBadge(countAttempts+1)
      this.extraBadgesScore+= extraAux;

      if(extraAux>0)
      {
        this.winBadges+=1;
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
        this.winBadges+=2;
        this.updateValueBadgeLevel(this.LEVEL_ID, this.winBadges);
      }
    }
  }

  getPendingQuestions(idStudent: number, idLevel: number|string, lastAttempt: Date)
  {
    let auxDate: Date=new Date(lastAttempt);
    let dateForComparison: string=`${auxDate.getFullYear()}-${auxDate.getMonth()+1}-${auxDate.getDate()} ${auxDate.getHours()}:${auxDate.getMinutes()}:${auxDate.getSeconds()}`;
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
    setTimeout(() =>
    {
      this.getQuestiontoShow();
    }, time);
  }

  addMoreTime()
  {
    this.actualTime+=7;
  }

  addAnotherAttempt()
  {
    this.anotherAttempt=true;
  }

  deleteTwoOptions()
  {
    let loop:number=this.countCorrectOptions(this.questions[this.actualQuestion].opciones)>2 ? 1:2, optionIndex;

    console.log(loop);

    for(let repeat=0;repeat<loop;repeat++)
    {
      optionIndex=Math.floor(this.getRandomArbitrary(0, 3));
      console.log(optionIndex);

      if(this.optionDisabled[optionIndex] && this.questions[this.actualQuestion].opciones[optionIndex].porcentaje_puntaje==0)
      {
        this.optionDisableColor[optionIndex]=true;
        this.optionDisabled[optionIndex]=false;
      }
      else
      {
        let i=0;
        while(!this.optionDisabled[optionIndex] && this.questions[this.actualQuestion].opciones[i].porcentaje_puntaje!=0)
        {
          console.log(i);
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
    let dateForComparison: string=`${dateToCompare.getFullYear}-${dateToCompare.getMonth}-${dateToCompare.getDate} ${dateToCompare.getHours}:${dateToCompare.getMinutes}:${dateToCompare.getSeconds}`;
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
      let boosters: Array<any>=this.setBoosterArray();

      this.userService.setUsedBoosterOnLevel(idLevel, +localStorage.getItem('userId')).subscribe(res =>
      {
        console.log('se registro el booster usado');

        if(idBooster==3)
        {
          this.skipQuestion(idLevel, idQuestion, dateToCompare);
        }
        else
        {
          if(idBooster==0||idBooster==1||idBooster==2)
          {
            boosters[idBooster];
          }
        }

        this.availableCoins-=this.BOOSTER_PRICES[idBooster];
        this.changeCoinsQuantity(this.SUBJECT_ID, +localStorage.getItem('userId'), (this.availableCoins-this.BOOSTER_PRICES[idBooster]));
      }, err =>
      {
        console.log(err);
      });
    }

  }

  setBoosterArray()
  {
    var boosters: Array<any>=new Array<any>(3);

    boosters.push(this.addMoreTime());
    boosters.push(this.addAnotherAttempt());
    boosters.push(this.deleteTwoOptions());

    return boosters;
  }

  changeCoinsQuantity(idSubject: number, idStudent: number, coins: number)
  {
    this.userService.setCountCoins(idSubject, idStudent, coins).subscribe(res =>
    {
      console.log(res);
    },err =>
    {

    })
  }

  getBadges(idLevel: number|string)
  {
    const getRestDataFromBadge=(badge:badgeData) =>
    {
      return new Promise((res) =>
      {
        this.levelService.getBadgeSpecify(badge.id_insignia, badge.tipo_insignia).subscribe(specify =>
        {
          res(specify[0]);
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
    console.log(badges);

    badges.forEach(badge =>
    {
      console.log(badge);

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

  async updateValueBadgeLevel(idLevel: number|string, newValue: number)
  {
    console.log(newValue, newValue.toString(2));

    //this.levelService.updateUsedBadges(idLevel, localStorage.getItem('userId'), (newValue >>> 0).toString(2)).subscribe(res =>
    this.levelService.updateUsedBadges(idLevel, localStorage.getItem('userId'), newValue.toString(2)).subscribe(res =>
    {
      console.log(res);
      console.log("Se actualizó el valor de las insignias correctamente");
    },err =>
    {
      console.log(err);
    });

    await this.showWonBadgeAlert();
  }

  getBadgePic(indexBadge: number)
  {
    return badgeInfo[indexBadge][1];
  }

  getBadgeDetails(indexBadge: number)
  {
    return badgeInfo[indexBadge][2];
  }

  async showWonBadgeAlert()
  {
    this.showWonAlert=true;
    await new Promise((resolve) => {
      setTimeout(() => {
          // Resolve the promise
          this.showWonAlert=false;
          resolve(console.log('hello'));
      }, 3000);
  });
  }

  initializeBoosterPrices()
  {
    this.constantService.getBoosterPrices().subscribe(prices =>
    {
      let i=0;
      console.log(prices);

      prices.forEach(price =>
      {
        this.BOOSTER_PRICES[i++]=price;
      });
    });/*
    this.BOOSTER_PRICES[0]= 100;
    this.BOOSTER_PRICES[1]= 500;
    this.BOOSTER_PRICES[2]= 250;
    this.BOOSTER_PRICES[3]= 1000;*/
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
