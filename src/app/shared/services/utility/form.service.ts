import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { passwordMatchValidator } from '../../../pages/register/validators/validators';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  formBuilder = inject(FormBuilder);

  createEditProfileFormGroup(
    selectedDay?: number,
    selectedMonth?: number,
    selectedYear?: number
  ): FormGroup {
    return this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: this.formBuilder.control('', [Validators .required]),
        lastName: this.formBuilder.control('', [Validators.required]),
      }),
      username: this.formBuilder.control('', [Validators.required]),
      birthday: this.formBuilder.group({
        day: this.formBuilder.control(selectedDay, [Validators.required]),
        month: this.formBuilder.control(selectedMonth, [Validators.required]),
        year: this.formBuilder.control(selectedYear, [Validators.required]),
      }),
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      passwords: this.formBuilder.group(
        {
          password: this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(8),
          ]),
          confirmPassword: this.formBuilder.control('', [Validators.required]),
        },
        { validators: passwordMatchValidator() }
      ),
    });
  }
}
