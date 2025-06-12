import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LoginRequestsService } from '../../../services/login-requests.service';
import { LoginFormService } from '../../../services/login-form.service';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

import { UtilitySessionService } from '../../../../../shared/services/utility/utility.service';
import { size } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  providers: [LoginFormService, LoginRequestsService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  isLoading: boolean = false;
  isErrorMsgShowed = false;
  errorMsg: string = '';
  size = size;

  loginForm!: FormGroup;

  formService = inject(LoginFormService);
  reqService = inject(LoginRequestsService);
  router = inject(Router);
  storage = inject(UtilitySessionService);
  utilitySessionStorage = inject(UtilitySessionService);

  ngOnInit(): void {
    this.loginForm = this.formService.createLoginForm();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.reqService.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('User logged successfully', response);
          
          this.storage.setToken(response.token);
          this.storage.setUserInfo(response.userInfo);

          this.utilitySessionStorage.setToken(response.token);
          this.utilitySessionStorage.setUserInfo(response.userInfo);

          this.router.navigate(['feed']);
          this.isErrorMsgShowed = false;
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMsg = error.error.message;

          if (!this.errorMsg) {
            return;
          }

          this.isErrorMsgShowed = true;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
