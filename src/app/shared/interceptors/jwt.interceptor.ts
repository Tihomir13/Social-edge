import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../services/utility/utility.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  utilitySessionStorage = inject(UtilitySessionService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.utilitySessionStorage.getToken();
    console.log('JwtInterceptor is adding token to request:', token);

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.log('JwtInterceptor: No token found');
    }

    return next.handle(request);
  }
}
