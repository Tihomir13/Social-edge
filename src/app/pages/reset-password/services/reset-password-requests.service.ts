import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../shared/services/utility/utility.service';
import { api } from '../../../shared/constants/api';

@Injectable()
export class ResetPasswordRequestsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  resetPassword(
    passwords: {
      newPassword: string;
      confirmPassword: string;
    },
    token: string
  ): Observable<any> {
    return this.http.post(`${api}/reset-password?token=${token}`, {
      passwords,
    });
  }
}
