import { RouterModule } from '@angular/router';
import { DropdownDirective } from './shared/dropdown.directive';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
import { HomeComponent } from './home/home.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { SubjectComponent } from './subject/subject.component';
import { LoginComponent } from './login/login.component';
import { NavegationComponent } from './subject/navegation/navegation.component';
import { OptionsComponent } from './subject/options/options.component';
import { LevelComponent } from './subject/level/level.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditSubjectComponent } from './subject/edit-subject/edit-subject.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import { CreateLevelComponent } from './create-level/create-level.component';
import { AddUserComponent } from './add-user/add-user.component';
import { LevelQuestionsComponent } from './level-questions/level-questions.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { SelectQuestionTypeComponent } from './create-question/select-question-type/select-question-type.component';
import { MultipleChoiceComponent } from './create-question/multiple-choice/multiple-choice.component';
import { LevelResultComponent } from './level-questions/level-result/level-result.component';
import { LevelQuestionsContainerComponent } from './level-questions/level-questions-container/level-questions-container.component';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { AchievementMenuComponent } from './participants-list/achievement-menu/achievement-menu.component';
import { CreateFlashcardComponent } from './flashcards/create-flashcard/create-flashcard.component';
import { MenuFlashcardsComponent } from './flashcards/menu-flashcards/menu-flashcards.component';
import { ShowFlashcardsComponent } from './flashcards/show-flashcards/show-flashcards.component';
import { ContainerFlashcardComponent } from './flashcards/container-flashcard/container-flashcard.component';
import { EditFlashcardComponent } from './flashcards/edit-flashcard/edit-flashcard.component';
import { ShowFlashcardResultComponent } from './flashcards/show-flashcard-result/show-flashcard-result.component';
import { PresentationComponent } from './presentation/presentation.component';
import { CopyLevelsComponent } from './subject/copy-levels/copy-levels.component';
import { LevelEditComponent } from './subject/level/level-edit/level-edit.component';
import { BadgeMenuComponent } from './subject/edit-subject/badge-menu/badge-menu.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    CreateSubjectComponent,
    HomeComponent,
    UserRegisterComponent,
    SubjectComponent,
    LoginComponent,
    NavegationComponent,
    OptionsComponent,
    LevelComponent,
    EditSubjectComponent,
    CreateLevelComponent,
    AddUserComponent,
    LevelQuestionsComponent,
    CreateQuestionComponent,
    SelectQuestionTypeComponent,
    MultipleChoiceComponent,
    LevelResultComponent,
    LevelQuestionsContainerComponent,
    ParticipantsListComponent,
    AchievementMenuComponent,
    CreateFlashcardComponent,
    MenuFlashcardsComponent,
    ShowFlashcardsComponent,
    ContainerFlashcardComponent,
    EditFlashcardComponent,
    ShowFlashcardResultComponent,
    PresentationComponent,
    CopyLevelsComponent,
    LevelEditComponent,
    BadgeMenuComponent,
    AccountActivationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    BsDropdownModule,
    CollapseModule,
    ChartsModule,
    NgbModule,
    SocialLoginModule,
  ],
  providers:
  [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '151329789164-ehvnceigb8aqm11uii1ebdp4lm2rdklt.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '1161166887721679'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }/*,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '1161166887721679'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
