import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FormService } from '../../../../../../../../../shared/services/utility/form.service';
import { Subscription } from 'rxjs';
import { ProfileRequestsService } from '../../../profile/services/profile-requests.service';

@Component({
  selector: 'app-security',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent {
  backwardIcon = faChevronLeft;

  isPasswordChangeSuccessfully = false;
  isPasswordValid = true;

  passwordFormGroup!: FormGroup;
  router = inject(Router);
  formService = inject(FormService);
  profileRequestsService = inject(ProfileRequestsService);

  subscriptions: Subscription = new Subscription();

  navigateBack() {
    this.router.navigate(['settings']);
  }

  ngOnInit(): void {
    this.passwordFormGroup = this.formService.createPasswordChangeFormGroup();
  }

  onSubmit(): void {
    if (!this.passwordFormGroup.valid) {
      this.isPasswordValid = false;
      return;
    }

    this.subscriptions.add(
      this.profileRequestsService
        .changePassword(this.passwordFormGroup.value.passwords)
        .subscribe({
          next: (response) => {
            console.log('Password changed successfully:', response);
            this.isPasswordChangeSuccessfully = true;
          },
        })
    );
  }
}
