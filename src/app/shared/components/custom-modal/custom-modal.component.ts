import { NgStyle } from '@angular/common';
import { Component, HostListener, input, output, signal } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [NgStyle, LoadingSpinnerComponent],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss',
})
export class CustomModalComponent {
  title = input();
  options = input<{ optionName: string; optionColor: string }[]>();
  private _loading = signal<{
    listElemIndex: number;
    isLoading: boolean;
  } | null>(null);
  clickedOption = output<string>();

  loading = this._loading.asReadonly();

  onChosenOption(optionName: string) {
    this.clickedOption.emit(optionName);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.modal-container')) {
      this.clickedOption.emit('Cancel');
    }
  }

  setLoading(state: { listElemIndex: number; isLoading: boolean }) {
    this._loading.set(state);
  }

  clearLoading() {
    this._loading.set(null);
  }
}
