import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../shared/services/utility/utility.service';
import { api } from '../../../../../../../shared/constants/api';

@Injectable({
  providedIn: 'root',
})
export class MessagesRequestService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  headers = {
    headers: this.utility.headers,
  };

  getMessages(body: any): Observable<any> {
    return this.http.post(`${api}/messages/get`, body, {headers: this.utility.headers});
  }
}
