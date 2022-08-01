import { baseURL } from './../shared/baseUrl';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailSenderService {

  constructor(private http: HttpClient) { }

  sendEmail(emailInformation) {
    const emailUrl=`${baseURL}/sendEmail/students`;

    return this.http.post(emailUrl, emailInformation);
  }
}
