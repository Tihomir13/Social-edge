import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ForgottenPasswordFormService } from './services/forgotten-password-form.service';
import { Subscription } from 'rxjs';
import { ForgottenPasswordRequestsService } from './services/forgotten-password-requests.service';

@Component({
  selector: 'app-forgotten-password',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [ForgottenPasswordFormService, ForgottenPasswordRequestsService],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.scss',
})
export class ForgottenPasswordComponent {
  isSuccessful = false;
  isWrong = false;

  forgottenPasswordFormGroup!: FormGroup;
  subscriptions = new Subscription();

  forgottenPasswordFormService = inject(ForgottenPasswordFormService);
  forgottenPasswordRequests = inject(ForgottenPasswordRequestsService);

  constructor() {
    this.forgottenPasswordFormGroup =
      this.forgottenPasswordFormService.generateForgottenPasswordForm();
  }

  get isFieldEmpty() {
    return this.forgottenPasswordFormGroup.get('emailUsername')?.value === '';
  }

  resetResponseMessages(): void {
    this.isSuccessful = false;
    this.isWrong = false;
  }

  onSubmit(): void {
    if (!this.forgottenPasswordFormGroup.valid) {
      return;
    }
    this.resetResponseMessages();

    const value = this.forgottenPasswordFormGroup.get('emailUsername')?.value;

    this.subscriptions.add(
      this.forgottenPasswordRequests.searchForAccount(value).subscribe({
        next: () => {
          this.isSuccessful = true;
        },
        error: () => {
          this.isWrong = true;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
