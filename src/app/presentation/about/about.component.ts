import { ConstantService } from './../../services/constant.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  description: Array<string>=new Array<string>();

  constructor(private constantService: ConstantService) { }

  ngOnInit(): void {
    this.getDescription();
  }

  getDescription()
  {
    this.constantService.getGamificationDescription().subscribe(res =>
    {
      res.forEach(words =>
      {
        this.description.push(words.content);
      });
    });
  }
}
