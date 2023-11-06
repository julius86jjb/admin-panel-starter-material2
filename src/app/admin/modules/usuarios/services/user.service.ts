import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from './../../../../../environments/environments';
import { Injectable, OnInit, computed, inject, signal } from '@angular/core';
import { Observable, catchError, combineLatest, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { PaginatedUsers } from '../interfaces/paginated-users';
import { User } from '../../../../auth/interfaces/user.interface';
import { CountriesService } from 'src/app/admin/shared/modules/country/services/countries.service';
import { LittleCountry } from 'src/app/admin/shared/modules/country/interfaces/country.interface';
import { LoginResponse } from 'src/app/auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  private readonly baseUrl: string = environments.baseUrl;

  private http = inject(HttpClient);
  private countriesService = inject(CountriesService);

  private _users = signal<User[]>([]);
  private _currentPage = signal<number>(1);
  private _totalUsers = signal<number>(0);
  private _totalPages = signal<number>(0);


  public users = computed(() => this._users());
  public currentPage = computed(() => this._currentPage());
  public totalUsers = computed(() => this._totalUsers());
  public totalPages = computed(() => this._totalPages());

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.token}`);


  constructor() {
  }


  ngOnInit(): void {
  }

  setUsersListData(response: PaginatedUsers) {
    this._totalPages.set(response.page_total)
    this._totalUsers.set(response.total)
    this._users.set(response.users);
  }



  loadPage(page: number, term?: string): Observable<PaginatedUsers> {

    if (term) {
      const url = `${this.baseUrl}/usuarios/busqueda/${term}`;
      return this.http.get<PaginatedUsers>(url, { params: { page: page }, headers: this.headers })
        .pipe(
          tap(resp => this.setUsersListData(resp)),
          tap(() => this._currentPage.set(page)),

        )
    } else {
      const url = `${this.baseUrl}/usuarios`;
      return this.http.get<PaginatedUsers>(url, { params: { page: page }, headers: this.headers })
        .pipe(
          tap(resp => this.setUsersListData(resp)),
          tap(() => this._currentPage.set(page))
        )
    }
  }

  create(user: any): Observable<User> {

    const url = `${this.baseUrl}/usuarios`;
    return this.countriesService.getLittleCountryByAlphaCode(user.country).pipe(
      tap(country => {
        user.country = {
          name: country?.name,
          cca2: country?.cca2
        }
      }),
      map(() => user),
      switchMap((user: User) => this.http.post<User>(url, user, { headers: this.headers })),
      catchError(err => throwError(() => err.error.message))
    )
  }

  update(user: any): Observable<User> {

    const url = `${this.baseUrl}/usuarios/${user._id}`;
    return this.countriesService.getLittleCountryByAlphaCode(user.country).pipe(
      tap(country => {
        user.country = {
          name: country?.name,
          cca2: country?.cca2
        }
      }),
      map(() => user),
      map((user) => {
        const { _id, ...userDto } = user
        return userDto
      }),
      switchMap((userDto: User) => this.http.patch<User>(url, userDto, { headers: this.headers })),
      catchError(err => throwError(() => err.error.message))
    )
  }

  getUserById(id: string): Observable<User> {
    const url = `${this.baseUrl}/usuarios/${id}`;
    return this.http.get<User>(url, { headers: this.headers })
  }

  checkCredentials(id: string, email: string, password: string) {
    const url = `${this.baseUrl}/check-credentials/${id}`;
    const body = { email, password }

    return this.http.post<LoginResponse>(url, body, { headers: this.headers })
      .pipe(
        map((resp) => resp.user)
      )
  }


  changeEmail(id: string, oldEmail: string, password: string, newEmail: string) {

    return this.checkCredentials(id, oldEmail, password).pipe(
      map((user) => {
        console.log({user})
        const userUpdated = {
          _id: user._id,
          email: newEmail
        } as User
        return userUpdated
      }),
      switchMap((userDto: User) => this.saveUser(userDto)),
      catchError(err => {
        return throwError(() => err.error.message)
      })
    )
  }

  changePassword(id: string, email: string, password: string, newPassword: string) {

    return this.checkCredentials(id, email, password).pipe(
      map((user) => {
        const userUpdated = {
          _id: user._id,
          password: newPassword
        } as User
        return userUpdated
      }),
      switchMap((userDto: User) => this.updatePassword(userDto)),
      catchError(err => {
        return throwError(() => err.error.message)
      })
    )
  }



  saveUser(updatedUser: User) {
    const { _id, ...user } = updatedUser
    return this.http.patch(`${this.baseUrl}/usuarios/${updatedUser._id}`, user, { headers: this.headers });
  }

  updatePassword(updatedUser: User) {
    const { _id, ...user } = updatedUser
    return this.http.patch(`${this.baseUrl}/usuarios/update-password/${updatedUser._id}`, user, { headers: this.headers });
  }

  deleteUser(id: string): Observable<User> {
    const url = `${this.baseUrl}/usuarios/${id}`;
    return this.http.delete<User>(url, { headers: this.headers })
  }



}


