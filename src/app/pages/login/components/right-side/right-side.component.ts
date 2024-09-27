import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { Router, RouterModule } from '@angular/router';
import { GoogleBtnComponent } from '../../../../shared/components/google-btn/google-btn.component';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [LoginFormComponent, RouterModule, GoogleBtnComponent],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss',
})
export class RightSideComponent {}
