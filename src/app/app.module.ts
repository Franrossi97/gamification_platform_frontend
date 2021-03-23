import { RouterModule } from '@angular/router';
import { DropdownDirective } from './shared/dropdown.directive';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http';

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
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import { CreateLevelComponent } from './create-level/create-level.component';
import { AddUserComponent } from './add-user/add-user.component';
import { LevelQuestionsComponent } from './level-questions/level-questions.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { SelectQuestionTypeComponent } from './create-question/select-question-type/select-question-type.component';
import { MultipleChoiceComponent } from './create-question/multiple-choice/multiple-choice.component';


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
    MultipleChoiceComponent
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
    CollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
