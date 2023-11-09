import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from 'src/environments/environments';
import { UploadResponse } from '../../modules/usuarios/interfaces/upload-response.interface';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { UserService } from '../../modules/usuarios/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private readonly baseUrl: string = environments.baseUrl;

  private http = inject(HttpClient);


  updateImg(archivo: File, tipo: string, id: string): Observable<string> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/${tipo}/upload/${id}`;


    const formData = new FormData();
    formData.append('avatar', archivo);
    return this.http.post<UploadResponse>(url, formData, { headers: headers })
      .pipe(
        map((resp) => resp.fileName),
        catchError(err => {
          return throwError(() => err.error.message)
        })
      )
  }

}
