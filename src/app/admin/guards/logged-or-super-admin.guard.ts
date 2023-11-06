import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

export const LoggedOrSuperAdminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(route.params['id']);
  console.log(authService.currentUser()!._id);

  if (authService.currentUser()!._id === route.params['id'] || authService.currentUser()!.role === Role.SuperAdmin) {
    return true;
  } else {
    router.navigateByUrl('/admin/dashboard');
    return false;
  }
};
