import { Injectable } from '@angular/core';
import { Week } from '../models/week.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { retry, catchError, map } from 'rxjs/operators';
import { Observable, throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WeekService {
  endpoint: string = environment.apiUrl + '/weeks';
  server: string = environment.apiUrl + '/sidur';
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient, private router: Router) { }
  addWeek(week): Observable<Week> {
    return this.http.post<Week>(this.endpoint, week)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  getWeeks() {
    return this.http.get(`${this.endpoint}/getAllByStartDate`);
  }

  getWeekByCreator() {
    return this.http.get(`${this.endpoint}/getWeekByCreator`);
  }

  deleteWeek() {
    return this.http.delete(`${this.endpoint}/deleteWeek`);
  }

  getAllSidurs() {
    return this.http.get(`${this.server}/allSidurs`);
  }

  getLastSidur(start, end) {

    return this.http.get(`${this.server}/getLastSidur/` + start + '/' + end);
  }


  // getSidurById(id) {
  //   return this.http.get(`${this.server}/getSidurById/` + id);
  // }


  // Get Sidur
  getSidurById(id): Observable<any> {
    let url = `${this.server}/getSidurById/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorHandl)
    )
  }

  //sidur!!!!!
  createSidur(sidur): Observable<Week> {
    return this.http.post<Week>(this.server, sidur)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  // getSidurByDate(start, end) {
  //   return this.http.get(`${this.server}/getSidurByDate/` + start + '/' + end);
  // }

  getSidurByDate(start, end) {
    return this.http.get(`${this.server}/getSidurByDate/` + start + '/' + end);
  }

  // Update week
  updateWeek(id, data): Observable<any> {
    let url = `${this.endpoint}/update/${id}`;
    return this.http.put(url, data).pipe(
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

