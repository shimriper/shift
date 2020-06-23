import { Injectable } from '@angular/core';
import { Shift } from '../models/shift.model';

import { Router } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SmsService {
  endpoint = environment.apiUrl + '/sms';

  constructor(
    private http: HttpClient,
    private router: Router) { }

  sendSms(sms) {
    return this.http.post(this.endpoint + '/sendSms', sms)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
