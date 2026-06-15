import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-challenge-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './challenge-create.html'
})
export class ChallengeCreateComponent {
  regex: string = '';
  positiveExample: string = '';
  negativeExample: string = '';
  positiveStringsText: string = '';
  negativeStringsText: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private challengeService = inject(ChallengeService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    this.errorMessage = '';

    if (!this.regex || !this.positiveExample || !this.negativeExample) {
      this.errorMessage = 'Please provide the regex and both visible examples.';
      return;
    }

    const positiveTestStrings = this.positiveStringsText
      // String formatting
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const negativeTestStrings = this.negativeStringsText
      // String formatting
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (positiveTestStrings.length === 0 || positiveTestStrings.length > 10 || 
        negativeTestStrings.length === 0 || negativeTestStrings.length > 10) {
      this.errorMessage = `You must provide between 1 and 10 hidden test strings for each category.`;
      return;
    }

    this.isLoading = true;

    // DTO transferred to createChallenge
    const payload = {
      regex: this.regex,
      positiveExample: this.positiveExample,
      negativeExample: this.negativeExample,
      positiveTestStrings: positiveTestStrings,
      negativeTestStrings: negativeTestStrings
    };

    this.challengeService.createChallenge(payload).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Error while creating the challenge. Please try again later.';
        } else {
          this.errorMessage = err.error?.error || 'Challenge creation failed. Please check your inputs.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
