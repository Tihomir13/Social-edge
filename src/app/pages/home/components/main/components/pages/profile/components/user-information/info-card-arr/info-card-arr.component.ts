import { Component, inject, input } from '@angular/core';

import { ProfileStateService } from '../../../services/profile-state.service';
import { ShortenMonthPipe } from '../../../../../../../../../shared/pipes/shorten-month.pipe';

@Component({
  selector: 'app-info-card-arr',
  standalone: true,
  // imports: [ShortenMonthPipe],
  templateUrl: './info-card-arr.component.html',
  styleUrl: './info-card-arr.component.scss',
})
export class InfoCardArrComponent {
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


  userInfo: any = input();
  alt = input<string>();
  imgSrc = input<string>();

  isUserAdding = false;

  state = inject(ProfileStateService);

  onAdd(): void {
    this.isUserAdding = true;
  }
  
  onCancel(): void {
    this.isUserAdding = false;
  }

  onSubmit(): void {
    
  }

  ngOnInit(): void {
    this.selectedDay = this.date.getDate();
    this.selectedMonth = this.date.getMonth();
    this.selectedYear = this.date.getFullYear();
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
}
