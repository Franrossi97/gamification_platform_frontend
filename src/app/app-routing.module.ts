import { CreateQuestionComponent } from './create-question/create-question.component';
import { LevelQuestionsComponent } from './level-questions/level-questions.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
import { HomeComponent } from './home/home.component';
import { SubjectComponent } from './subject/subject.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AuthGuard } from './auth/auth.guard'
import { EditSubjectComponent } from './subject/edit-subject/edit-subject.component';
import { SelectQuestionTypeComponent } from './create-question/select-question-type/select-question-type.component';
import { MultipleChoiceComponent } from './create-question/multiple-choice/multiple-choice.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'register', component: UserRegisterComponent},
  {path: 'subject/:id', component: SubjectComponent, canActivate: [AuthGuard], children:
  [
    {path: 'level/:id_level', component: EditSubjectComponent},
  ]},
  {path: 'level/:id', canActivate: [AuthGuard], children:
  [
    {path: 'question/create/select', component: SelectQuestionTypeComponent},
    {path: 'question/create/1', component: CreateQuestionComponent},
    {path: 'question/create/2', component: MultipleChoiceComponent},
    {path: 'questions', component: LevelQuestionsComponent},
  ]},
  {path: 'create-subject', component: CreateSubjectComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: '**', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
