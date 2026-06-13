import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';
  private httpOptions = { withCredentials: true };

  isAuthenticated = signal<boolean>(localStorage.getItem('isAuthenticated') === 'true'); // Signal for updating view after login

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, this.httpOptions).pipe(
      tap(() => {
        localStorage.setItem('isAuthenticated', 'true');
        this.isAuthenticated.set(true);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, this.httpOptions).pipe(
      tap(() => {
        localStorage.setItem('isAuthenticated', 'true');
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, this.httpOptions).pipe(
      tap(() => {
        localStorage.removeItem('isAuthenticated');
        this.isAuthenticated.set(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  clearLocalSession(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
