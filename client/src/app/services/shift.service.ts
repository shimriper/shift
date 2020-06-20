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
export class ShiftService {
  shiftSaved: any[] = [];
  endpoint: string = environment.apiUrl + '/shifts';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private router: Router) { }


  deleteAllReq() {
    return this.http.delete(`${this.endpoint}/deleteAllReq`);
  }

  // POST
  addShift(shifts): Observable<Shift> {
    return this.http.post<Shift>(this.endpoint, shifts)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  getMyShiftsByDate(start, end) {
    return this.http.get(`${this.endpoint}/getMyShifts/` + start + "/" + end);
  }

  getShifts() {
    return this.http.get(`${this.endpoint}/getAllByStartDate`);
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
