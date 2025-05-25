import { Component, inject } from '@angular/core';
import { ShortenMonthPipe } from '../../../../../../../shared/pipes/shorten-month.pipe';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormService } from '../../../../../../../shared/services/utility/form.service';
import { Subscription } from 'rxjs';
import { ProfileRequestsService } from '../profile/services/profile-requests.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-settings',
  imports: [ShortenMonthPipe, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent {
  lockIcon = faLock;

  editProfileFormGroup!: FormGroup;
  date: Date = new Date();
  subscriptions: Subscription = new Subscription();

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

  isUsernameExists = false;
  isEmailExists = false;
  isUserYounger = false;
  isDateValid = true;
  isUserRegistered = false;

  get firstNameControl(): AbstractControl | null {
    return this.editProfileFormGroup.get('name.firstName');
  }

  get lastNameControl(): AbstractControl | null {
    return this.editProfileFormGroup.get('name.lastName');
  }

  get birthdayGroup(): AbstractControl | null {
    return this.editProfileFormGroup.get('birthday');
  }

  // get selectedDay(): number {
  //   return this.birthdayGroup?.value.day;
  // }

  // get selectedMonth(): number {
  //   return this.birthdayGroup?.value.month;
  // }

  // get selectedYear(): number {
  //   return this.birthdayGroup?.value.month;
  // }

  get emailControl(): AbstractControl | null {
    return this.editProfileFormGroup.get('email');
  }

  get passwordGroupControl(): AbstractControl | null {
    return this.editProfileFormGroup.get('passwords');
  }

  get passwordControl(): AbstractControl | null {
    return this.editProfileFormGroup.get('passwords.password');
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.editProfileFormGroup.get('passwords.confirmPassword');
  }

  get isEmailValid(): boolean | undefined {
    return (
      this.emailControl?.value != '' &&
      this.emailControl?.invalid &&
      this.emailControl?.dirty
    );
  }

  formService = inject(FormService);
  profileRequestsService = inject(ProfileRequestsService);
  router = inject(Router);

  ngOnChanges(): void {
    this.adjustSelectedDay();
  }

  ngOnInit(): void {
    this.editProfileFormGroup = this.formService.createEditProfileFormGroup();
    this.getProfileSettings();

    console.log(this.editProfileFormGroup.get('birthday')?.value);
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

  getProfileSettings() {
    this.subscriptions.add(
      this.profileRequestsService.getProfileSettings().subscribe({
        next: (response) => {
          console.log(response);

          this.editProfileFormGroup.patchValue({
            username: response.profileSettings.username,
            name: {
              firstName: response.profileSettings.name.firstName,
              lastName: response.profileSettings.name.lastName,
            },
            email: response.profileSettings.email,
            birthday: {
              day: response.profileSettings.birthday.day,
              month: response.profileSettings.birthday.month,
              year: response.profileSettings.birthday.year,
            },
          });

          this.selectedDay = response.profileSettings.birthday.day;
          this.selectedMonth = response.profileSettings.birthday.month;
          this.selectedYear = response.profileSettings.birthday.year;

          console.log(this.editProfileFormGroup.get('birthday')?.value);
        },
        error: (error) => {
          console.error('Error fetching profile settings:', error);
        },
      })
    );
  }

  navigateToSecurity() {
    this.router.navigate(['/settings/security']);
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
