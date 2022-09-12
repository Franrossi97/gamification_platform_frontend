import { faAngleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
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
  filterForm: UntypedFormGroup;
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
    private fb: UntypedFormBuilder)
  {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(async params =>
    {
      await this.createFilterForm();

      this.idFlashcard= await Number(params.get('id_flashcard'));
      this.setFlashcardTitle(this.idFlashcard);
    });
  }

  getFlashcardItems(idFlashcard: number, quarter: number, year: number)
  {
    this.flashcardService.getFlashcardResult(idFlashcard, quarter, year).subscribe((itemsRes: Array<flashcardResult>) =>
    {
      this.flashcardItemsResult=itemsRes;
    });
  }

  createFilterForm()
  {
    this.filterForm=this.fb.group(
    {
      quarter: new UntypedFormControl('', Validators.required),
      year: new UntypedFormControl('', Validators.required),
    });
  }

  onSubmitFilters()
  {
    this.flashcardItemsResult=null;
    this.getFlashcardItems(this.idFlashcard, this.filterForm.get('quarter').value, this.filterForm.get('year').value);
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
    const initialYear= 2005, res: Array<number>=new Array<number>();

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
