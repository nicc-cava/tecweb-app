import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // This service is a singleton
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';
  private httpOptions = { withCredentials: true };

  isAuthenticated = signal<boolean>(localStorage.getItem('isAuthenticated') === 'true'); // The signal allows to update the view after the login

  register(userData: any): Observable<any> {
    // The pipe allows the data stream to flow without consuming it
    return this.http.post(`${this.apiUrl}/register`, userData, this.httpOptions).pipe(
      // The function tap executes side effect operations on the data
      tap(() => { 
        localStorage.setItem('isAuthenticated', 'true'); // Local storage update
        this.isAuthenticated.set(true); // Signal update to update the view
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

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, this.httpOptions);
  }

  updateAvatar(avatarBase64: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/avatar`, { avatar: avatarBase64 }, this.httpOptions);
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`, this.httpOptions);
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
