import { PermissionService } from './../../services/permission.service';
import { faAngleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, FormControl, Validator, Validators } from '@angular/forms';
import { FlashcardService } from './../../services/flashcard.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-show-flashcard-result',
  templateUrl: './show-flashcard-result.component.html',
  styleUrls: ['./show-flashcard-result.component.scss']
})
export class ShowFlashcardResultComponent implements OnInit {

  idFlashcard: number;
  titleFlashcard: string;
  flashcardItemsResult: Array<flashcardResult>=null;
  filterForm: FormGroup;
  leftArrowIcon=faAngleLeft;
  searchIcon=faSearch;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Lo sabe', 'Lo sabe parcialmente', 'No lo sabe'];
  public pieChartData: SingleDataSet = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private route: ActivatedRoute, private flashcardService: FlashcardService,
    private fb: FormBuilder)
  {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(async params =>
    {
      this.idFlashcard=Number(params.get('id_flashcard'));

      this.createFilterForm();
      this.setFlashcardTitle(this.idFlashcard);
    });
  }

  getFlashcardItems(idFlashcard: number, minMonth: number, maxMonth: number, year: number)
  {
    this.flashcardService.getFlashcardResult(idFlashcard, minMonth, maxMonth, year).subscribe((itemsRes: Array<flashcardResult>) =>
    {
      this.flashcardItemsResult=itemsRes;
    });
  }

  createFilterForm()
  {
    this.filterForm=this.fb.group(
    {
      quarter: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
    });
  }

  onSubmitFilters()
  {
    this.flashcardItemsResult=null;
    if(this.filterForm.get('quarter').value==1)
    {
      this.getFlashcardItems(this.idFlashcard, 3, 7, this.filterForm.get('year').value);
    }
    else
    {
      this.getFlashcardItems(this.idFlashcard, 8, 12, this.filterForm.get('year').value);
    }
  }

  setFlashcardTitle(idFlashcard: number)
  {
    this.flashcardService.getFlashcardTitle(idFlashcard).subscribe(title =>
    {
      this.titleFlashcard=title.titulo;
    });
  }

  generateArrayOfYears(): Array<number>
  {
    let initialYear= 2005, res: Array<number>=new Array<number>();

    for (let i = initialYear; i < 2999; i++) {
      res.push(i)
    }

    return res;
  }



}

interface flashcardResult
{
  id_item: number,
  contenido: string,
  sabe: number,
  sabe_parcial: number,
  no_sabe: number,
}
