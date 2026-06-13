import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-challenge-solve',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './challenge-solve.html'
})
export class ChallengeSolveComponent implements OnInit {
  challengeId: number = 0;
  challenge: any = null;
  proposedRegex: string = '';
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  result: any = null; 

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private challengeService = inject(ChallengeService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // Reads id from page URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.challengeId = +idParam;
        this.loadChallenge();
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  loadChallenge() {
    this.challengeService.getChallengeById(this.challengeId).subscribe({
      next: (data) => {
        this.challenge = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'The server is currently unreachable. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load challenge details. It might have been deleted.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.result = null;

    if (!this.proposedRegex) {
      this.errorMessage = 'Please enter a regular expression.';
      return;
    }

    this.isSubmitting = true;

    this.challengeService.solveChallenge(this.challengeId, this.proposedRegex).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.result = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 0) {
          this.errorMessage = 'The server is currently unreachable. Please try again later.';
        } else {
          this.errorMessage = err.error?.error || 'An error occurred while evaluating your regex.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
