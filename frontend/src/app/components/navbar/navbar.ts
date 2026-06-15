import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Error during logout', err)
    });
  }
}
