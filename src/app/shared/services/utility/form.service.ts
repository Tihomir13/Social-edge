import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { passwordMatchValidator } from '../../../pages/register/validators/validators';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  formBuilder = inject(FormBuilder);

  createEditProfileFormGroup(): FormGroup {
    return this.formBuilder.group({
      // username: this.formBuilder.control('', [Validators.required]),
      name: this.formBuilder.group({
        firstName: this.formBuilder.control('', [Validators.required]),
        lastName: this.formBuilder.control('', [Validators.required]),
      }),
      birthday: this.formBuilder.group({
        day: this.formBuilder.control(1, [Validators.required]),
        month: this.formBuilder.control(0, [Validators.required]),
        year: this.formBuilder.control(2000, [Validators.required]),
      }),
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  createPasswordChangeFormGroup(): FormGroup {
    return this.formBuilder.group({
      passwords: this.formBuilder.group(
        {
          oldPassword: this.formBuilder.control('', [Validators.required]),
          newPassword: this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(8),
          ]),
          confirmNewPassword: this.formBuilder.control('', [
            Validators.required,
          ]),
        },
        { validators: passwordMatchValidator() }
      ),
    });
  }
}
