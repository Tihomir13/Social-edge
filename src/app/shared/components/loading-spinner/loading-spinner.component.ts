import { Component, input } from '@angular/core';

export enum size {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  classes = input<string>('text-light');
  size = input<size>()
}
