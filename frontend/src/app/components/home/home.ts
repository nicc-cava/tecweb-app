import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  challenges: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  private challengeService = inject(ChallengeService);
  private cdr = inject(ChangeDetectorRef); 

  // This method runs automatically when the component is loaded
  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getAllChallenges().subscribe({
      next: (data) => {
        this.challenges = data; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching challenges:', err);
        this.errorMessage = 'Failed to load challenges. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
