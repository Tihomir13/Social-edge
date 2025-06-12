import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  isDarkModeEnabled = signal<boolean>(false);

  toggleDarkMode(): void {
    this.isDarkModeEnabled.update((current) => !current);

    document.body.setAttribute('data-bs-theme', this.isDarkModeEnabled() ? 'dark' : 'light');
  }

  setDarkMode(isDarkMode: boolean): void {
    this.isDarkModeEnabled.set(isDarkMode);
  }
}
