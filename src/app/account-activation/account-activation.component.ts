import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {

  id: string;
  //jwt: string;
  error=false;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(async params =>
    {
      this.id=await params['id'];

      this.activateUser(+this.id);
    });
  }

  activateUser(userId: number)
  {
    this.userService.activateUser(userId).subscribe(res =>
    {
      console.log('Éxito');
    }, err =>
    {
      this.error=false;
    });
  }

  continue()
  {
    this.router.navigate(['login']);
  }

}
