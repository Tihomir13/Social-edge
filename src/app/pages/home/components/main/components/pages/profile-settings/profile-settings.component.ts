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
import { MainStateService } from '../../../shared/services/main-state.service';

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
  mainState = inject(MainStateService);

  ngOnChanges(): void {
    this.adjustSelectedDay();
  }

  ngOnInit(): void {
    this.editProfileFormGroup = this.formService.createEditProfileFormGroup();

    if (this.mainState.settingsOriginalInfo()) {
      this.editProfileFormGroup.patchValue(
        this.mainState.settingsOriginalInfo()
      );

      this.selectedDay = this.mainState.settingsOriginalInfo().birthday.day;
      this.selectedMonth = this.mainState.settingsOriginalInfo().birthday.month;
      this.selectedYear = this.mainState.settingsOriginalInfo().birthday.year;

      return;
    }

    this.getProfileSettings();
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
          const responseData = {
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
          };

          this.mainState.settingsOriginalInfo.set(responseData);

          this.editProfileFormGroup.patchValue(responseData);

          this.selectedDay = response.profileSettings.birthday.day;
          this.selectedMonth = response.profileSettings.birthday.month;
          this.selectedYear = response.profileSettings.birthday.year;
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

  resetErrors(): void {
    this.isUsernameExists = false;
    this.isEmailExists = false;
    this.isUserYounger = false;
    this.isDateValid = true;
  }

  isBirthdayDifferent(
    a: { day: number; month: number; year: number },
    b: { day: number; month: number; year: number }
  ): boolean {
    return a.day !== b.day || a.month !== b.month || a.year !== b.year;
  }

  isNameEqual(
    name1: { firstName: string; lastName: string },
    name2: { firstName: string; lastName: string }
  ): boolean {
    return (
      name1.firstName !== name2.firstName || name1.lastName !== name2.lastName
    );
  }

  onSubmit(): void {
    // if (this.isSameAsToday(this.editProfileFormGroup.value.birthday)) {
    //   this.isDateValid = false;
    //   return;
    // } else {
    //   this.isDateValid = true;
    // }

    console.log('Form Value:', this.editProfileFormGroup.value);
    console.log('Original Info:', this.mainState.settingsOriginalInfo());

    const newData: any = {};

    if (
      this.isNameEqual(
        this.editProfileFormGroup.value.name,
        this.mainState.settingsOriginalInfo().name
      )
    ) {
      newData.name = this.editProfileFormGroup.value.name;
    }

    if (
      this.isBirthdayDifferent(
        this.editProfileFormGroup.value.birthday,
        this.mainState.settingsOriginalInfo().birthday
      )
    ) {
      newData.birthday = this.editProfileFormGroup.value.birthday;
    }

    if (
      this.editProfileFormGroup.value.username !==
      this.mainState.settingsOriginalInfo().username
    ) {
      newData.username = this.editProfileFormGroup.value.username;
    }

    if (
      this.editProfileFormGroup.value.email !==
      this.mainState.settingsOriginalInfo().email
    ) {
      newData.email = this.editProfileFormGroup.value.email;
    }

    console.log('New Data:', newData);

    if (this.editProfileFormGroup.valid) {
      this.subscriptions.add(
        this.profileRequestsService.editProfileSettings(newData).subscribe({
          next: (response) => {
            console.log(response);
            this.mainState.settingsOriginalInfo.set(
              this.editProfileFormGroup.value
            );
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
              this.isEmailExists = false;
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
}
