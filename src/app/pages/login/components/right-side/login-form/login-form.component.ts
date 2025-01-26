import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginRequestsService } from '../../../services/login-requests.service';
import { LoginFormService } from '../../../services/login-form.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [LoginFormService, LoginRequestsService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;

  formService = inject(LoginFormService);
  reqService = inject(LoginRequestsService);
  router = inject(Router);

  isErrorMsgShowed = false;
  errorMsg: string = '';

  ngOnInit(): void {
    this.loginForm = this.formService.createLoginForm();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.reqService.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('User logged successfully', response);
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userInfo', JSON.stringify(response.userInfo));

          this.router.navigate(['feed']);
          this.isErrorMsgShowed = false;
        },
        error: (error) => {
          console.error('Login failed', error);
          this.isErrorMsgShowed = true;
          this.errorMsg = error.error.message;
        },
      });
    }
  }
}
