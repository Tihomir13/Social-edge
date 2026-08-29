import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../shared/services/utility/utility.service';
import { environment } from '../../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagesRequestService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  headers = {
    headers: this.utility.headers,
  };

  getMessages(currChatUser: any, cursor: any, limit: number): Observable<any> {
    const body = {
      username: currChatUser.username,
      cursor,
      limit
    };
    
    return this.http.post(`${environment.api}/messages/get`, body, {
      headers: this.utility.headers,
    });
  }
}
