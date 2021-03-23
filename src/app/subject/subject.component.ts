import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { LevelService } from './../services/level.service';
import { SubjectService } from './../services/subject.service';
import { Component, Input, OnInit } from '@angular/core';
import { SubjectClass } from '../shared/Subject';
import { Level } from '../shared/Level';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit
{
  userType:number=0;
  subject: SubjectClass;
  levels:Level[];
  constructor(private subjectService:SubjectService, private levelService:LevelService, private userService: UserService,
  private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.subject=new SubjectClass();
    this.subject.nombre="Prueba";
    this.receiveData();

    this.getUserType();
    this.route.params.subscribe(params =>
    {
      this.getWholeSubjectData(params['id']);
    })
  }

  getUserType()
  {
    this.userService.numberUserType(localStorage.getItem('userId'), this.route.snapshot.params.id).subscribe((userType: number) =>
    {
      console.log('tomo tipo de usuario');
      console.log(userType);
      this.userType=userType;
    })
  }

  receiveData()
  {
    this.subjectService.sendData().subscribe(subject =>
    {
      this.subject=subject;
      console.log('hola');

      console.log(this.subject);
      this.subjectService.getLevels(this.subject.id_materia).subscribe(levels =>
      {
        this.levels=levels;

        this.levels.forEach((level:Level) =>
        {
          this.levelService.getUnits(level.id_nivel).subscribe(units =>
          {
            level.unitList=units;
          });
        });
        console.log(`Cantidad: ${this.subject.studentsCount}`);
      });
    });
  }

  getWholeSubjectData(id: number)
  {

    this.subjectService.getOneSubject(id).subscribe(res =>
    {
      console.log(res);

      this.subject=res[0];

      console.log(this.subject);
    })
  }
}
