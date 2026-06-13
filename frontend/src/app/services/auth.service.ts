import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  private httpOptions = {
    withCredentials: true // Forces the client to include cookies in every request
  };

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, this.httpOptions).pipe(
      tap(() => localStorage.setItem('isAuthenticated', 'true'))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, this.httpOptions).pipe(
      tap(() => localStorage.setItem('isAuthenticated', 'true'))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, this.httpOptions).pipe(
      tap(() => localStorage.removeItem('isAuthenticated'))
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
}
