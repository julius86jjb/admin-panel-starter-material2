import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, delay, map, of, filter, tap } from 'rxjs';

import { environments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class EmailValidator implements AsyncValidator {

  private readonly baseUrl: string = environments.baseUrl;

  private http = inject(HttpClient);


  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;

    const url = `${this.baseUrl}/check-email-exist/${email}`;

    return this.http.get(url)
      .pipe(
        map ((emailExist) => {
          return (emailExist ) ? {emailTaken: true} : null
        })
      )
  }

  // validate(control: AbstractControl):  Observable<ValidationErrors | null> {
  //   const email = control.value;

  //   return of({
  //     emailTaken: true
  //   }).pipe(
  //     delay(2000)
  //   )
  // }
  // validate(control: AbstractControl): Observable<ValidationErrors | null> {
  //   const email = control.value;

  //   const httpCallObservable = new Observable<ValidationErrors | null>((subscriber) => {
  //     console.log({ email });
  //     if (email === 'ejemplo@google.com') {
  //       subscriber.next({ emailTaken: true });
  //       subscriber.complete();
  //     }

  //     subscriber.next(null);
  //     subscriber.complete();
  //   }).pipe(
  //     delay(3000)
  //   )

  //   return httpCallObservable;
  // }




}
