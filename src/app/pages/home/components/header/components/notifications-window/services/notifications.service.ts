import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../shared/services/utility/utility.service';
import { environment } from '../../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  getNotifications(): Observable<any> {
    return this.http.get(`${environment.api}/notifications`, { headers: this.utility.headers });
  }

   // Създаваме signal със стартова стойност 0
   refreshFriends = signal(0);

   // Метод, който актуализира signal-а
   triggerRefreshFriends() {
     this.refreshFriends.update((value) => value + 1);
   }
}
