import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';

import { AdminAuthService } from './admin-auth.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const auth = inject(AdminAuthService);
  if (await auth.waitForAdmin()) return true;

  window.location.href = 'https://online.pnmc.org.pk/admin/login';
  return false;
};
