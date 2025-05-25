import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-security',
  imports: [FontAwesomeModule],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent {
  backwardIcon = faChevronLeft;

  router = inject(Router);

  navigateBack() {
    this.router.navigate(['settings']);
  }
}
