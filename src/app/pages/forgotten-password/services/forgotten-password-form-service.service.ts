import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class ForgottenPasswordFormServiceService {
  fb = inject(FormBuilder);

  generateForgottenPasswordForm(): FormGroup {
    return this.fb.group({ emailUsername: ['', Validators.required] });
  }
}
