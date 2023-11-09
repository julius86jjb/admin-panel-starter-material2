import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal, OnInit } from '@angular/core';
import { Observable, catchError, delay, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { RegisterResponse } from '../interfaces/register-response.interface';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { environments } from '../../../environments/environments';
import { INavData } from '@coreui/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService{


  private readonly baseUrl: string = environments.baseUrl;
  private http = inject (HttpClient);
  private router = inject (Router);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed ( () => this._currentUser());
  public authStatus = computed ( () => this._authStatus());

  constructor(public route: ActivatedRoute) {
    this.checkAuthStatus().subscribe()
  }

  get role(): 'user' | 'admin' | 'super_admin' {
    return this._currentUser()!.role;
  }



  private setAuthentication(user: User, token: string, menu: INavData[]): boolean {
    this._currentUser.set(user);
    this._authStatus.set( AuthStatus.authenticated);
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));

    return true;
  }

  login( email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/login`;
    const body = { email: email, password: password}
    // const body = { email, password}

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map( ({user, token, menu}) => this.setAuthentication(user, token, menu)),
        catchError( err => {
          return throwError( () => err.error.message)
        })
      )

    // return of(true);
  }



  register(nombre: string, email: string, password: string): Observable<RegisterResponse> {
    const url = `${this.baseUrl}/register`;
    const body = {name: nombre, email: email, password: password}

    return this.http.post<RegisterResponse>(url, body)
      .pipe(
        catchError( err => {
          return throwError( () => err.error.message)
        })
      )
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/check-token`;
    const token = localStorage.getItem('token');

    if(!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);


    return this.http.get<CheckTokenResponse>(url, {headers: headers})
      .pipe(

        map(({token, user, menu}) => this.setAuthentication(user, token, menu)),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      )

  }


  logout() {
    this.router.navigateByUrl('/auth/login');
    this._authStatus.set( AuthStatus.notAuthenticated );
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    localStorage.removeItem('url');
    this._currentUser.set(null);
  }
}
