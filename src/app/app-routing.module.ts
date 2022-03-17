import { EditUserComponent } from './admin-menu/edit-user/edit-user.component';
import { AdminAddUserComponent } from './admin-menu/admin-add-user/admin-add-user.component';
import { AdminGuard } from './auth/admin/admin.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './admin-menu/user-list/user-list.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { UserProfileComponent } from './header/user-profile/user-profile.component';
import { FlashcardsPermissionGuard } from './auth/flashcards/flashcards-permission.guard';
import { LevelEditComponent } from './subject/level/level-edit/level-edit.component';
import { PresentationComponent } from './presentation/presentation.component';
import { ShowFlashcardsComponent } from './flashcards/show-flashcards/show-flashcards.component';
import { EditFlashcardComponent } from './flashcards/edit-flashcard/edit-flashcard.component';
import { ContainerFlashcardComponent } from './flashcards/container-flashcard/container-flashcard.component';
import { LevelQuestionsContainerComponent } from './level-questions/level-questions-container/level-questions-container.component';
import { LevelResultComponent } from './level-questions/level-result/level-result.component';
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
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { MenuFlashcardsComponent } from './flashcards/menu-flashcards/menu-flashcards.component';
import { CreateFlashcardComponent } from './flashcards/create-flashcard/create-flashcard.component';
import { ShowFlashcardResultComponent } from './flashcards/show-flashcard-result/show-flashcard-result.component';
import { CopyLevelsComponent } from './subject/copy-levels/copy-levels.component';
import { PermissionGuard } from './auth/permission/permission.guard';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { CreateFlashcardGuard } from './auth/create-flashcard/create-flashcard.guard';

const routes: Routes = [
  {path: 'home', component: PresentationComponent},
  {path: 'subjects', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'register', component: UserRegisterComponent},
  {path: 'subject/:id', component: SubjectComponent, canActivate: [AuthGuard], children:
  [
    {path: 'level/:id_level', component: EditSubjectComponent},
    //{path: 'participants', component: ParticipantsListComponent},
  ]},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'subject/:id_subject/participants', component: ParticipantsListComponent, canActivate: [AuthGuard, PermissionGuard]},
  {path: 'subject/:id_subject/copy', component: CopyLevelsComponent, canActivate: [AuthGuard, PermissionGuard]},
  {path: 'subject/:id_subject/level/:id_level/edit', component: LevelEditComponent, canActivate: [AuthGuard, PermissionGuard]},
  {path: 'subject/:id_subject/level/:id', canActivate: [AuthGuard, PermissionGuard], children:
  [
    {path: 'question/create/select', component: SelectQuestionTypeComponent},
    {path: 'question/create/1', component: CreateQuestionComponent},
    {path: 'question/create/2', component: MultipleChoiceComponent},
  ]},
  {path: 'level/:id/questions', component: LevelQuestionsContainerComponent, canActivate: [AuthGuard], children:
  [
    {path: '', component: LevelQuestionsComponent},
    {path: 'result', component: LevelResultComponent},
  ]},
  {path: 'flashcards', component: ContainerFlashcardComponent, canActivate: [AuthGuard], children:
  [
    {path: 'list', component: MenuFlashcardsComponent},
    {path: 'create', component: CreateFlashcardComponent, canActivate: [CreateFlashcardGuard]},
    {path: ':id_flashcard/show', component: ShowFlashcardsComponent},
    {path: ':id_flashcard/edit', component: EditFlashcardComponent, canActivate: [FlashcardsPermissionGuard]},
    {path: ':id_flashcard/result', component: ShowFlashcardResultComponent, canActivate: [FlashcardsPermissionGuard]}
  ]},
  {path: 'create-subject', component: CreateSubjectComponent, canActivate: [AuthGuard, PermissionGuard]},
  {path: 'activation/:id/:jwt', component: AccountActivationComponent, canActivate: [AuthGuard]},
  {path: 'admin-menu', component: AdminMenuComponent, canActivate: [AuthGuard, AdminGuard], children:
  [
    {path: 'user-list', component: UserListComponent},
    {path: 'add-user', component: AdminAddUserComponent},
    {path: 'edit/:id_usuario', component: EditUserComponent},/*
    {path: ''},
    {path: ''},*/
  ]},
  {path: 'login', component: LoginComponent},
  {path: '**', component: PresentationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
