import { Component, inject } from '@angular/core';
import { ShortenMonthPipe } from '../../../../../../../shared/pipes/shorten-month.pipe';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../../../../../../shared/services/utility/form.service';

@Component({
  selector: 'app-profile-settings',
  imports: [ShortenMonthPipe, ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent {
  formService = inject(FormService);

  editProfileFormGroup!: FormGroup;
  onSubmit() {
    throw new Error('Method not implemented.');
  }
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

  ngOnInit(): void {
    this.editProfileFormGroup = this.formService.createEditProfileFormGroup();
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
}
