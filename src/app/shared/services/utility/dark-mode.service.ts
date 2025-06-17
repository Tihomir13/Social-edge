import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  isDarkMode(): boolean {
    const body = document.body;
    const theme = body.getAttribute('data-bs-theme');
    return theme === 'dark';
  }

  toggleTheme(): void {
    const body = document.body;
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-bs-theme', newTheme);
  }
}
