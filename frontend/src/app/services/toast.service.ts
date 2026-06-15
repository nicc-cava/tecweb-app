import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' // This is a singleton
})
export class ToastService {
  message = signal<string>('');
  isVisible = signal<boolean>(false);
  isError = signal<boolean>(true);

  show(msg: string, isError: boolean = true, durationMs: number = 4000) {
    // The signals allow a direct connction with the DOM
    this.message.set(msg);
    this.isError.set(isError);
    this.isVisible.set(true);

    // Destruction
    setTimeout(() => {
      this.isVisible.set(false);
    }, durationMs);
  }
}
