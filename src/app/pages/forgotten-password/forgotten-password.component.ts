import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ForgottenPasswordFormServiceService } from './services/forgotten-password-form-service.service';
import { Subscription } from 'rxjs';
import { ForgottenPasswordRequestsService } from './services/forgotten-password-requests.service';

@Component({
  selector: 'app-forgotten-password',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [
    ForgottenPasswordFormServiceService,
    ForgottenPasswordRequestsService,
  ],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.scss',
})
export class ForgottenPasswordComponent {
  forgottenPasswordFormGroup!: FormGroup;
  subscriptions = new Subscription();

  forgottenPasswordFormService = inject(ForgottenPasswordFormServiceService);
  forgottenPasswordRequests = inject(ForgottenPasswordRequestsService);

  constructor() {
    this.forgottenPasswordFormGroup =
      this.forgottenPasswordFormService.generateForgottenPasswordForm();
  }

  get isFieldEmpty() {
    return this.forgottenPasswordFormGroup.get('emailUsername')?.value === '';
  }

  onSubmit(): void {
    if (!this.forgottenPasswordFormGroup.valid) {
      return;
    }

    const value = this.forgottenPasswordFormGroup.get('emailUsername')?.value;

    this.subscriptions.add(
      this.forgottenPasswordRequests.searchForAccount(value).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }
}
