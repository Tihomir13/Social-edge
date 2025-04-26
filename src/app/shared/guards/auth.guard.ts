import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StoragesService } from '../../pages/home/shared/services/storages.service';
import { UtilitySessionService } from '../services/utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router = inject(Router);
  utilitySessionStorage = inject(UtilitySessionService);

  canActivate(): boolean {
    const token = this.utilitySessionStorage.getToken();

    if (token) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
