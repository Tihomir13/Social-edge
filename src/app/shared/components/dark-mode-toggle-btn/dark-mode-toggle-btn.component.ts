import { Component, inject } from '@angular/core';
import { DarkModeService } from '../../../pages/home/components/main/shared/services/dark-mode.service';

@Component({
  selector: 'app-dark-mode-toggle-btn',
  imports: [],
  templateUrl: './dark-mode-toggle-btn.component.html',
  styleUrl: './dark-mode-toggle-btn.component.scss'
})
export class DarkModeToggleBtnComponent {
  darkModeService = inject(DarkModeService)

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  enableDarkModeToBody() {
    if (this.darkModeService.isDarkModeEnabled()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
