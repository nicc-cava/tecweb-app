import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html'
})
export class LeaderboardComponent implements OnInit {
  players: any[] = [];
  isLoading = true;

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.authService.getLeaderboard().subscribe({
      next: (data) => {
        this.players = data.map(p => ({
          ...p,
          avgAttempts: p.solvedCount > 0 ? (p.attemptsCount / p.solvedCount).toFixed(1) : p.attemptsCount
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
