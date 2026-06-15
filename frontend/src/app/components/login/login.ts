import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // The function subscribe allows the component to consume the data stream passed by the service through the pipe
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Error during login. Please try again later.';
        } else {
          this.errorMessage = err.error?.error || 'Login failed. Please check your credentials.';
        }
        this.cdr.detectChanges(); // The CDR forces the rendering of the page when the asyncronous call ends
      }
    });
  }
}
