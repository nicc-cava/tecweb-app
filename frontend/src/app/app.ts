import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html'
})
export class App {
  title = 'frontend';
  toastService = inject(ToastService); // Make the service publicly available to avoid toasts to disappear after changing page
}
