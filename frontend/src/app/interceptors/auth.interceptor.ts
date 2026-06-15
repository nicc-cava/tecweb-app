import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  // The call "next(req)" sends the request to the backend
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      const isAuthRoute = req.url.includes('/login') || req.url.includes('/register');

      // If the session is expired and the user is not already trying to log in
      if (error.status === 401 && !isAuthRoute) {
        toastService.show('Your session has expired. Please log in again.', true, 5000);
        authService.clearLocalSession(); // Redirection to login
      }

      return throwError(() => error); // Sends the error to the component
    })
  );
};
