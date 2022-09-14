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

  getUnits(idLevel:number|string): Observable<Array<Unit>>
  {
    const url = `${baseURL}/level/${idLevel}/units`;

    return this.http.get<Array<Unit>>(url);
  }

  addNewLevelUnit(levelId: number|string, newUnit: Array<Unit>): Observable<number>
  {
    const newLevelUrl =`${baseURL}/level/${levelId}/unit`;

    return this.http.post<number>(newLevelUrl, newUnit);
  }

  editUnitLevelName(editUnit: Unit)
  {
    const editUnitNameUrl =`${baseURL}/unit/${editUnit.id_unidad}`;

    return this.http.patch(editUnitNameUrl, editUnit);
  }

  deleteUnitLevel(unitId: number|string)
  {
    const deleteUrl =`${baseURL}/unit/${unitId}`;

    return this.http.delete(deleteUrl);
  }
}
