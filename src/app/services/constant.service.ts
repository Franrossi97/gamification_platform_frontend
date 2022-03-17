import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor(private http: HttpClient) { }

  getBoosterPrices()
  {
    const geturl=`${baseURL}/boosterprice`;

    return this.http.get<Array<any>>(geturl);
  }

  getBlocks()
  {
    const getUrl=`${baseURL}/blockinformation`;

    return this.http.get<Array<any>>(getUrl);
  }

  getGamificationDescription()
  {
    const getUrl=`${baseURL}/description`;

    return this.http.get<Array<any>>(getUrl);
  }
}
