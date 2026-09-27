import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AdminAuthService } from './admin-auth.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  return (await auth.waitForAdmin()) || router.createUrlTree(['/admin/login']);
};
