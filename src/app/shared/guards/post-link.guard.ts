import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilitySessionService } from '../services/utility/utility.service';

export const postLinkGuard: CanActivateFn = (route) => {
  const utilitySession = inject(UtilitySessionService);
  const router = inject(Router);

  if (utilitySession.getToken()) {
    return router.createUrlTree(['/p', route.paramMap.get('id')]);
  }

  return true;
};
