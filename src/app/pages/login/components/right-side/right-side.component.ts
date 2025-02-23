import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component';
import { GoogleBtnComponent } from '../../../../shared/components/google-btn/google-btn.component';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [LoginFormComponent, RouterModule, GoogleBtnComponent],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss',
})
export class RightSideComponent {}
