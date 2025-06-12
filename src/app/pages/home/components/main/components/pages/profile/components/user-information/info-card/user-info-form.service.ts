import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserInfoFormService {
  private formBuilder = inject(FormBuilder);
  generateUserInfoForm(): FormGroup {
    return this.formBuilder.group({
      info: this.formBuilder.control<string>('', Validators.required),
    });
  }
}
