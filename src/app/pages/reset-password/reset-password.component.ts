import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ResetPasswordFormService } from './services/reset-password-form.service';
import { ResetPasswordRequestsService } from './services/reset-password-requests.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule],
  providers: [ResetPasswordFormService, ResetPasswordRequestsService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  isSuccessful = false;
  isWrong = false;
  message?: string;

  resetPasswordResetFormGroup!: FormGroup;
  subscriptions = new Subscription();

  resetPasswordFormService = inject(ResetPasswordFormService);
  resetPasswordRequestsService = inject(ResetPasswordRequestsService);
  route = inject(ActivatedRoute);

  constructor() {
    this.resetPasswordResetFormGroup =
      this.resetPasswordFormService.generateResetPasswordForm();
  }

  resetResponseMessages(): void {
    this.isSuccessful = false;
    this.isWrong = false;
  }

  get PasswordValid(): boolean | undefined {
    const passwordControl = this.resetPasswordResetFormGroup.get('password');

    return (
      (passwordControl?.value != '' &&
        passwordControl?.invalid &&
        passwordControl?.dirty) ||
      passwordControl?.touched
    );
  }

  get confirmPasswordValid(): boolean | undefined {
    const confirmPasswordControl =
      this.resetPasswordResetFormGroup.get('confirmPassword');

    return (
      (confirmPasswordControl?.value != '' &&
        confirmPasswordControl?.invalid &&
        confirmPasswordControl?.dirty) ||
      confirmPasswordControl?.touched
    );
  }

  onSubmit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!this.resetPasswordResetFormGroup.valid && token) {
      return;
    }

    if (this.isSuccessful || this.isWrong) {
      this.resetResponseMessages();
    }

    const passwords = {
      newPassword: this.resetPasswordResetFormGroup.get('password')?.value,
      confirmPassword:
        this.resetPasswordResetFormGroup.get('confirmPassword')?.value,
    };

    this.subscriptions.add(
      this.resetPasswordRequestsService
        .resetPassword(passwords, token!)
        .subscribe({
          next: (response) => {
            this.isSuccessful = true;
            this.message = response.message;
          },
          error: (error) => {
            this.isWrong = true;
            this.message = error.error.message;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
