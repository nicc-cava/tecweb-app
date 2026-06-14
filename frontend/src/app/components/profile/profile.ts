import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading = true;
  isSaving = false;
  previewUrl: string | null = null;

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.previewUrl = data.avatar;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.show('Failed to load profile', true);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Controllo sicurezza: Max 500 KB (Base64 pesa di più)
    if (file.size > 500 * 1024) {
      this.toastService.show('File is too large. Max 500KB allowed.', true);
      return;
    }

    // Legge il file e lo trasforma in stringa Base64
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  saveAvatar() {
    if (!this.previewUrl) return;
    
    this.isSaving = true;
    this.authService.updateAvatar(this.previewUrl).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.show('Avatar updated successfully!', false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSaving = false;
        this.toastService.show('Failed to save avatar.', true);
        this.cdr.detectChanges();
      }
    });
  }
}
