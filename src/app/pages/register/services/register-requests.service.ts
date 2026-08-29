import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable()
export class RegisterRequestsService {
  private http = inject(HttpClient);

  registerUser(userData: any): Observable<any> {
    console.log(userData);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.api}/register`, userData, { headers });
  }
}
