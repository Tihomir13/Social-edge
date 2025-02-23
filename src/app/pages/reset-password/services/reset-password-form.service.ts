import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { passwordMatchValidator } from '../../register/validators/validators';

@Injectable()
export class ResetPasswordFormService {
  fb = inject(FormBuilder);

  generateResetPasswordForm(): FormGroup {
    return this.fb.group(
      {
        password: this.fb.control('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: this.fb.control('', [Validators.required]),
      },
      { validators: passwordMatchValidator() }
    );
  }
}
