import { Injectable, ɵConsole } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';
import { DayTemplateContext } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-day-template-context';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = environment.apiUrl + '/user';

  endpointReset = environment.apiUrl + '/resetpassword'
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  // currentUser = {};
  private lastLogin: Date;
  private isAuthenticated = false;
  private token: string;
  private rule: string;
  private tokenTimer: any;
  private userId: string;
  private userName: string;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }
  getUserName() {
    return this.userName;
  }
  getLastLogin() {
    return this.lastLogin;
  }
  getMyRule() {
    return this.rule;
  }
  getToken() {
    return this.token;
  }
  getUserId() {
    // const userId = localStorage.getItem('userID');
    return this.userId;
  }

  getIsAuth() {
    this.autoAuthUser();
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAllUsers() {
    return this.http.get(`${this.endpoint}/AllUsers`);
  }
  disabeldUserById(id) {
    return this.http.put(this.endpoint + '/disabeldUser/' + id, id);
  }

  // Update employee
  updateUser_i(id, data): Observable<any> {
    let url = `${this.endpoint}/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }




  // Update student
  UpdateUser(id, data) {
    this.http.put(this.endpoint + "/update-user/" + id, data).subscribe(response => {
      console.log(response);
    });
  }
  // Get User
  getUser(id): Observable<any> {
    let url = `${this.endpoint}/read/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
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

  // Delete User
  deleteUser(user): Observable<any> {
    var id = user._id;
    let url = `${this.endpoint}/delete/` + id;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    )
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
    this.http.post<{ token: string, expiresIn: number, userId: string, userName: string, role: string, lastModify: Date }>(api, authData)
      .subscribe(response => {
        const token = response.token;
        const u_id = response.userId;
        this.userId = response.userId;
        this.userName = response.userName;
        this.token = token;
        this.rule = response.role;
        this.lastLogin = response.lastModify;
        const role = response.role;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = response.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          const l_login = new Date(this.lastLogin);
          this.saveAuthData(token, expirationDate, u_id, role, this.userName, l_login);
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
      this.rule = authInformation.role;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.userName = authInformation.userName;
      this.lastLogin = authInformation.lastLogin;
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.rule = null;
    this.userName = null;
    this.lastLogin = null;

    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, role: string, userName: string, lastLogin: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);

    localStorage.setItem('userName', userName);
    localStorage.setItem('lastLogin', lastLogin.toISOString());

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('lastLogin');

  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');
    const lastLogin = localStorage.getItem('lastLogin');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      role,
      userName,
      lastLogin : new Date (lastLogin)
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
