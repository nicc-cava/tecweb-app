import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/challenges';

  private httpOptions = {
    withCredentials: true 
  };

  getAllChallenges(): Observable<any> {
    return this.http.get(this.apiUrl, this.httpOptions);
  }

  getChallengeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  createChallenge(challengeData: any): Observable<any> {
    return this.http.post(this.apiUrl, challengeData, this.httpOptions);
  }

  solveChallenge(challengeId: number, proposedRegex: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${challengeId}/solve`, { proposedRegex }, this.httpOptions);
  }
}
