import { UserService } from './../../services/user.service';
import { FlashcardService } from './../../services/flashcard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, inject, flush } from '@angular/core/testing';

import { ShowFlashcardsComponent } from './show-flashcards.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Flashcard } from 'src/app/shared/Flashcard';
import { FlashcardItem } from 'src/app/shared/FlashcardItem';

describe('ShowFlashcardsComponent', () => {
  let component: ShowFlashcardsComponent;
  let fixture: ComponentFixture<ShowFlashcardsComponent>;
  let flashcardService;
  let userService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowFlashcardsComponent ],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue:
          {
            paramMap: of(convertToParamMap({id_flashcard: 2}))
          }
        }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.flashcardCount).toEqual(-1);
    expect(component.showEnd).not.toBeTrue();
    expect(component.selectedError).not.toBeTrue();
    expect(component.blockButtons).not.toBeTrue();
  });

  it('should call service to get flashcard information', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'getFlashcardById').and.returnValue(new Observable<Flashcard>());

    component.ngOnInit();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(flashcardService.getFlashcardById).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should call service to get the flashcard item by id', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'getFlashcardItems').and.returnValue(new Observable<Array<FlashcardItem>>());

    component.ngOnInit();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(flashcardService.getFlashcardItems).toHaveBeenCalledTimes(1);
      expect(component.flashcardCount).toEqual(0);
      done();
    });
  });

  it('should select answer call service to register it', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'registerFlashcardResult').and.returnValue(new Observable<any>());
    component.ngOnInit();

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      component.blockButtons=false;

      fixture.detectChanges();
      fixture.whenStable();

      const button= fixture.debugElement.nativeElement.querySelector('#losebutton');

      button.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(flashcardService.registerFlashcardResult).toHaveBeenCalledTimes(1);

      done();
      flush();
    }));
  });

  it('should change the flashcard to be showed', (done) =>
  {
    flashcardService= TestBed.inject(FlashcardService);
    spyOn(flashcardService, 'registerFlashcardResult').and.returnValue(new Observable<any>());
    component.ngOnInit();
    component.blockButtons=true;

    fixture.detectChanges();
    fixture.whenStable().then(fakeAsync(() =>
    {
      const buttonLeft= fixture.debugElement.nativeElement.querySelector('#flashcardleft');
      const buttonRight= fixture.debugElement.nativeElement.querySelector('#flashcardright');

      buttonLeft.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.flashcardCount).toEqual(0);

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.flashcardCount).toEqual(1);

      buttonRight.click();

      fixture.detectChanges();
      fixture.whenStable();

      expect(component.flashcardCount).toEqual(1);

      done();
      flush();
    }));
  });

  it('should check to save the results', () =>
  {
    userService= TestBed.inject(UserService);
    spyOn(userService, 'numberUserType').and.returnValue(Promise.resolve());

    component.checkSaveResult(1);

    expect(userService.numberUserType).toHaveBeenCalledTimes(1);
  });
});
