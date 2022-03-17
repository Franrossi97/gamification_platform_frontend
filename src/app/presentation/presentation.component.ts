import { ConstantService } from './../services/constant.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  blockNames: Array<string>=new Array<string>();
  description: Array<string>=new Array<string>();
  imagesCarousel=['welcome_banner.png', 'learn_playing.png'].map((name) => `../../assets/img/${name}`);
  constructor(private constantService: ConstantService) { }

  ngOnInit(): void
  {
    this.getBlockNames();
    this.getDescription();
  }


  openLink(link: string)
  {
    window.open(link, '_blank');
  }

  getBlockNames()
  {
    this.constantService.getBlocks().subscribe(res =>
    {
      let i=0;
      res.forEach(name =>
      {
        this.blockNames.push(name.content);
      });
      console.log(res);

    });
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
