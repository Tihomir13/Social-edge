import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UtilitySessionService } from '../../../shared/services/utility/utility.service';

import { Observable } from 'rxjs';

import { api } from '../../../shared/constants/api';

@Injectable({
  providedIn: 'root',
})
export class DeleteAccountRequestService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  verifyLink(token: string): Observable<any> {
    return this.http.get(`${api}/delete-account?token=${token}`);
  }
}
