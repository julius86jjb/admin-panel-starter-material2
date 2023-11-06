import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country, LittleCountry, Region, smallCountry } from '../interfaces/country.interface';
import { Observable, catchError, combineLatest, map, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })



export class CountriesService {

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Europa, Region.Asia, Region.Oceania]

  private baseUrl: string = 'https://restcountries.com/v3.1'

  public countryName: string ='';

  constructor(private http: HttpClient) { }

  get regions(): Region[] {
    return [...this._regions]
  }

  getCountriesByRegion(region: Region): Observable<smallCountry[]> {
    if (!region) return of([]);

    const url = `${this.baseUrl}/region/${region}?fields=name,cca3,borders`;

    return this.http.get<Country[]>(url).pipe(
      map(countries => countries.map(country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      })))
    )
  }

  getAllCountries(): Observable<Country[]> {
    const url = `${this.baseUrl}/all`;

    return this.http.get<Country[]>(url)
  }

  getAllCountriesLittle(): Observable<Country[]> {
    const url = `${this.baseUrl}/all?fields=name,cca2,flag`;

    return this.http.get<Country[]>(url)
  }

  getBordersByCountry(country: smallCountry): Observable<string[]> {
    if (!country) return of([]);

    const url = `${this.baseUrl}/name/${country}?fields=borders`;

    return this.http.get<string[]>(url).pipe(
      tap((borders) =>console.log(borders))
    )
  }

  getCountryByAlphaCode(alphaCode: string): Observable<smallCountry> {
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=name,cca3,borders`;

    return this.http.get<Country>(url).pipe(
      map(country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      }))
    )
  }

  getLittleCountryByAlphaCode(alphaCode: string): Observable<LittleCountry | undefined>  {
    if (!alphaCode) return of(undefined);
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=name,cca2`;

    return this.http.get<Country>(url).pipe(
      map(country => ({
        name: country.name.common,
        cca2: country.cca2.toLowerCase(),
      })),
      catchError(err => throwError(() => err.error.message))

    )


  }

  getCountriesByCodes( codes: string[]): Observable<smallCountry[]> {
    if(!codes || codes.length === 0) return of([]);

    const countriesRequests: Observable<smallCountry>[] = []

    codes.forEach( code => {
      const req = this.getCountryByAlphaCode(code);
      countriesRequests.push(req);
    })
    return combineLatest(countriesRequests)
  }

}
