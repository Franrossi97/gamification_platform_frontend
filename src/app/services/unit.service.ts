import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseUrl';
import { Unit } from '../shared/Unit';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private http:HttpClient) { }

  getUnits(id_level:number|string): Observable<Array<Unit>>
  {
    let url:string=`${baseURL}/level/${id_level}/units`;

    return this.http.get<Array<Unit>>(url);
  }
}
