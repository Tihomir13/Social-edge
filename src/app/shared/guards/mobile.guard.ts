import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const mobileGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (window.innerWidth <= 768) {
    return true;
  } else {
    router.navigate(['feed']);
    return false;
  }
};
