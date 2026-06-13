import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  message = signal<string>('');
  isVisible = signal<boolean>(false);
  isError = signal<boolean>(true);

  show(msg: string, isError: boolean = true, durationMs: number = 4000) {
    this.message.set(msg);
    this.isError.set(isError);
    this.isVisible.set(true);

    setTimeout(() => {
      this.isVisible.set(false);
    }, durationMs);
  }
}
