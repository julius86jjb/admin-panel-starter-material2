import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const SuperAdminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.role === 'super_admin') {
    return true;
  } else {
    router.navigateByUrl('/admin/dashboard');
    return false;
  }
};
