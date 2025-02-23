import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../shared/services/utility/utility.service';
import { api } from '../../../shared/constants/api';

@Injectable()
export class ForgottenPasswordRequestsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  searchForAccount(credentials: string): Observable<any> {
    return this.http.post(`${api}/forgot-password`, { credentials });
  }
}
