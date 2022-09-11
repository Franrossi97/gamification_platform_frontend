import { ParticipantsListService } from './../../services/participants-list.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Achievement } from 'src/app/shared/Achievement';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {faMinus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-achievement-menu',
  templateUrl: './achievement-menu.component.html',
  styleUrls: ['./achievement-menu.component.scss']
})
export class AchievementMenuComponent implements OnInit {

  @Input() idStudent: number;
  @Input() studentName: string;
  ID_SUBJECT: number;
  minusIcon=faMinus;
  newAchievementForm: UntypedFormGroup;
  showNewAchievementForm: boolean=false;
  userAchievements: Array<Achievement>;
  subjectAchievements: Array<Achievement>;
  errorMessageOnCreate: boolean=false;
  errorMessageOnAssignation: boolean=false;
  selectedAchievements: Array<number>=new Array<number>();

  constructor(private route: ActivatedRoute, private participantsListService: ParticipantsListService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(param =>
    {
      this.ID_SUBJECT=param.id_subject;
      this.getAchievementDataUser(param.id_subject, this.idStudent);
      this.getAchievementDataSubject(param.id_subject);

      this.createAchievementForm();
    });
  }

  getAchievementDataUser(idSubject: string|number, idStudent: number)
  {
    this.participantsListService.getAchievementsForUser(idSubject, idStudent).subscribe((res: Array<Achievement>) =>
    {
      this.userAchievements=res;
    });

  }

  getAchievementDataSubject(idSubject: string|number)
  {
    this.participantsListService.getAchievementsForSubject(idSubject).subscribe((res: Array<Achievement>) =>
    {
      console.log(res);

      this.subjectAchievements=res;
    });
  }

  onCreateAchievementForm()
  {
    this.showNewAchievementForm=!this.showNewAchievementForm;

    this.showNewAchievementForm ? this.createAchievementForm() : this.newAchievementForm=null;
    //this.createAchievementForm();
  }

  createAchievementForm()
  {
    this.newAchievementForm=this.fb.group(
    {
      title: new UntypedFormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]),
      description: new UntypedFormControl('', [Validators.required, Validators.maxLength(200), Validators.minLength(0)]),
      increment: new UntypedFormControl(0, [Validators.required, Validators.max(100), Validators.min(0)])
    });
  }

  onCreateAchievement()
  {
    let achievement: Achievement=new Achievement(null,
      this.newAchievementForm.get('title').value, this.newAchievementForm.get('description').value,
      this.newAchievementForm.get('increment').value, this.ID_SUBJECT
    );

    this.participantsListService.createAchievement(achievement.id_materia, achievement).subscribe(res =>
    {
      console.log('creado');

      this.newAchievementForm.reset();

      this.showNewAchievementForm=false;
      achievement.id_logro=Number(res);
      this.subjectAchievements.push(achievement);
      this.errorMessageOnCreate=false;
    }, err =>
    {
      console.log(err);
      this.errorMessageOnCreate=true;
    });
  }

  onSelectAchievement(idAchievement: number)
  {
    let achievementIndex: number=this.selectedAchievements.indexOf(idAchievement);

    if(achievementIndex!=-1)
    {
      console.log('elimino');

      this.selectedAchievements.splice(achievementIndex, 1);

      console.log(this.selectedAchievements);
    }
    else
    {
      this.selectedAchievements.push(idAchievement);
    }

  }

  onAssignAchievement()
  {
    this.participantsListService.assignAchievements(this.idStudent, this.selectedAchievements).subscribe(res =>
    {
      this.selectedAchievements.forEach(idAchievement =>
      {
        this.userAchievements.push(
          this.subjectAchievements.find(achievement => achievement.id_logro==idAchievement)
        );
      });

      this.errorMessageOnAssignation=false;
      this.selectedAchievements.length=0;
    }, err =>
    {
      console.log(err);
      this.errorMessageOnAssignation=true;
    });
  }

  onUnassignAchievement(idAchievement: number)
  {
    this.participantsListService.unAssignAchievements(this.idStudent, idAchievement).subscribe(res =>
    {
      let achievement: Achievement=this.userAchievements.find(achievement => achievement.id_logro==idAchievement);

      this.userAchievements.splice(this.userAchievements.indexOf(achievement), 1);

    }, err=>
    {
      console.log(err);
    });
  }

  onDeleteAchievement(idAchievement: number)
  {
    this.participantsListService.deleteAchievement(idAchievement).subscribe(res =>
    {
      let achievment: Achievement=this.subjectAchievements.find(achievement => achievement.id_logro==idAchievement);

      this.subjectAchievements.splice(this.subjectAchievements.indexOf(achievment), 1);
    }, err=>
    {
      console.log(err);
    });
  }

}
