import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const url_destino = state.url;
  localStorage.setItem('url', url_destino);

  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  };
  if (authService.authStatus() === AuthStatus.checking) {
    return false;
  };

  router.navigateByUrl('/auth/login');

  return false;
};
