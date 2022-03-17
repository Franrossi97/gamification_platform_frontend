import { AchievementMenuComponent } from './achievement-menu/achievement-menu.component';
import { ParticipantsListService } from './../services/participants-list.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsListComponent } from './participants-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ParticipantsListComponent', () => {
  let component: ParticipantsListComponent;
  let fixture: ComponentFixture<ParticipantsListComponent>;
  let participantsListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantsListComponent, AchievementMenuComponent],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id_subject: 1})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsListComponent);

    participantsListService= TestBed.inject(ParticipantsListService);
    spyOn(participantsListService, 'getParticipantsForSubject').and.returnValue(of(
    [
    {
      id_usuario: 1,
      nombre: 'Franco',
      apellido: 'Rossi',
      mail: 'franrossi97@gmail.com',
      puntaje_prom: 3800,
      puntaje_tot: 5000,
      levelResult: null,
    }]));

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.SUBJECT_ID).toEqual(1);
      expect(component.availableFilters).toEqual([false, true, true, true]);
      expect(participantsListService.getParticipantsForSubject).toHaveBeenCalledTimes(1);
    });

  });

  it('should show details of the played levels when click the button', (done) =>
  {
    const button: HTMLLinkElement= fixture.debugElement.nativeElement.querySelector('#showMoreInfo');
    console.log(button);

    button.click();
    //button.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.showMoreInfo).toEqual(0);

      done();
    });
  });

  it('should return a list of used badges', (done) =>
  {
    const res=component.getBadgeName('1111');

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(res).toEqual(
      'Insignia de pregunta'+"\n"+'Insignia de tiempo máximo'+"\n"+
      'Insignia de fecha'+"\n"+'Insignia de intentos'+"\n");

      done();
    });
  });

  it('should open the modal and set the values to be sent there', (done) =>
  {
    component.assignAchieveToUser(null, 1, 'Franco Rossi');

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.selectedUserId).toEqual(1);
      expect(component.selectedUserName).toEqual('Franco Rossi');

      done();
    });
  });

  it('should apply the filter to show some users', () =>
  {
    component.applyFilter(1);

    fixture.detectChanges();
    fixture.whenStable().then(() =>
    {
      expect(component.availableFilters).toEqual([true, false, true, true]);
      expect(participantsListService.getParticipantsForSubject).toHaveBeenCalledTimes(1);
    });
  });
});
