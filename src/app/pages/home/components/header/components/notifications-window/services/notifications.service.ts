import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../shared/services/utility/utility.service';
import { api } from '../../../../../../../shared/constants/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  getNotifications(): Observable<any> {
    return this.http.get(`${api}/notifications`, { headers: this.utility.headers });
  }
}
