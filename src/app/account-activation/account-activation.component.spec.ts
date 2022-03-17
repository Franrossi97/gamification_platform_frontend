import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './../services/user.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationComponent } from './account-activation.component';
import { Observable } from 'rxjs';

describe('AccountActivationComponent', () => {
  let component: AccountActivationComponent;
  let fixture: ComponentFixture<AccountActivationComponent>;
  let userService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountActivationComponent ],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check activation', () =>
  {
    userService=TestBed.inject(UserService);

    spyOn(userService, 'activateUser').and.returnValue(new Observable<any>());

    component.id='0';

    component.activateUser(0);

    expect(userService.activateUser).toHaveBeenCalledTimes(1);
  });
});
