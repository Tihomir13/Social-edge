import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ShortenMonthPipe } from '../../shared/pipes/shorten-month.pipe';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { RegisterFormService } from './services/register-form.service';
import { RegisterRequestsService } from './services/register-requests.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GoogleBtnComponent } from '../../shared/components/google-btn/google-btn.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ShortenMonthPipe,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    GoogleBtnComponent,
  ],
  providers: [RegisterFormService, RegisterRequestsService, HttpClient],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  date: Date = new Date();
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years: number[] = Array.from(
    { length: 100 },
    (_, i) => this.date.getFullYear() - i
  );

  selectedDay!: number;
  selectedMonth!: number;
  selectedYear!: number;

  registerFormGroup!: FormGroup;

  get firstNameControl(): AbstractControl | null {
    return this.registerFormGroup.get('name.firstName');
  }

  get lastNameControl(): AbstractControl | null {
    return this.registerFormGroup.get('name.lastName');
  }

  get birthdayGroup(): AbstractControl | null {
    return this.registerFormGroup.get('birthday');
  }

  get emailControl(): AbstractControl | null {
    return this.registerFormGroup.get('email');
  }

  get passwordGroupControl(): AbstractControl | null {
    return this.registerFormGroup.get('passwords');
  }

  get passwordControl(): AbstractControl | null {
    return this.registerFormGroup.get('passwords.password');
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.registerFormGroup.get('passwords.confirmPassword');
  }

  get isEmailValid(): boolean | undefined {
    return (
      this.emailControl?.value != '' &&
      this.emailControl?.invalid &&
      this.emailControl?.dirty
    );
  }

  get isConfirmPassValid(): boolean | undefined {
    return (
      this.confirmPasswordControl?.value !== '' &&
      this.confirmPasswordControl?.dirty &&
      this.passwordGroupControl?.hasError('passwordsDoNotMatch')
    );
  }

  isUsernameExists = false;
  isEmailExists = false;
  isUserYounger = false;
  isDateValid = true;
  isUserRegistered = false;

  subscriptions = new Subscription();

  private formService = inject(RegisterFormService);
  private reqService = inject(RegisterRequestsService);

  ngOnInit(): void {
    this.selectedDay = this.date.getDate();
    this.selectedMonth = this.date.getMonth();
    this.selectedYear = this.date.getFullYear();

    this.registerFormGroup = this.formService.createRegisterForm(
      this.selectedDay,
      this.selectedMonth,
      this.selectedYear
    );
  }

  getDaysInMonth(): number[] {
    const daysInMonth = new Date(
      this.selectedYear,
      this.selectedMonth + 1,
      0
    ).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  onMonthChange(): void {
    this.selectedMonth = Number(this.selectedMonth);
    this.adjustSelectedDay();
  }

  onYearChange(): void {
    this.adjustSelectedDay();
  }

  private adjustSelectedDay(): void {
    const daysInNewMonth = this.getDaysInMonth().length;
    if (this.selectedDay > daysInNewMonth) {
      this.selectedDay = daysInNewMonth;
    }
  }

  isSameAsToday(birthday: {
    day: number;
    month: number;
    year: number;
  }): boolean {
    const { day, month, year } = birthday;

    const today = new Date();

    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  }

  resetErrors(): void {
    this.isUsernameExists = false;
    this.isEmailExists = false;
    this.isUserYounger = false;
    this.isDateValid = true;
  }

  onSubmit(): void {
    if (this.isSameAsToday(this.registerFormGroup.value.birthday)) {
      this.isDateValid = false;
      return;
    } else {
      this.isDateValid = true;
    }
    console.log(this.isSameAsToday(this.registerFormGroup.value.birthday));

    if (this.registerFormGroup.valid) {
      this.subscriptions.add(
        this.reqService.registerUser(this.registerFormGroup.value).subscribe({
          next: (response) => {
            console.log('User registered successfully', response);
            this.resetErrors();
            this.isUserRegistered = true;
          },
          error: (data) => {
            console.log(data.status);
            if (
              data.status === 409 &&
              data.error.message.includes('Username')
            ) {
              this.isUsernameExists = true;
            } else {
              this.isUsernameExists = false;
            }

            if (data.status === 409 && data.error.message.includes('Email')) {
              this.isEmailExists = true;
            } else {
              this.isEmailExists = true;
            }

            if (data.status === 422) {
              this.isUserYounger = true;
            } else {
              this.isUserYounger = false;
            }

            console.error('Registration failed', data);
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
