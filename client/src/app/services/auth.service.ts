import { Injectable, ɵConsole } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = environment.apiUrl + '/user';

  endpointReset = environment.apiUrl + '/resetpassword'
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  // currentUser = {};
  private isAuthenticated = false;
  private token: string;
  private rule: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }
  getMyRule() {
    return this.rule;
  }
  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAllUsers() {
    return this.http.get(`${this.endpoint}/getAllUsers`);
  }
  disabeldUserById(id) {
    return this.http.put(this.endpoint + '/disabeldUser/' + id, id);
  }

  // Update student
  UpdateUser(id, data) {
    this.http.put(this.endpoint + "/update-user/" + id, data).subscribe(response => {
      console.log(response);
    });
  }
  getUserById() {
    return this.http.get(`${this.endpoint}/getUserById`)
      .pipe(catchError(this.errorMgmt))
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
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


  createUser(name: string, email: string, password: string, phone: string) {
    const api = `${this.endpoint}/signup`;
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
      phone: phone
    };
    return this.http.post(api, authData).pipe(
      catchError(this.handleError)
    )
  }


  requestReset(body): Observable<any> {
    return this.http.post(`${this.endpointReset}/req-reset-password`, body);
  }

  newPassword(body): Observable<any> {

    return this.http.post(`${this.endpointReset}/new-password`, body);
  }
  ValidPasswordToken(body): Observable<any> {
    return this.http.post(`${this.endpointReset}/valid-password-token`, body);
  }

  login(email: string, password: string) {
    const api = `${this.endpoint}/login`;
    const authData = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string, role: string }>(api, authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.rule = response.role;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = response.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/sidur-list']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userID');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

}
