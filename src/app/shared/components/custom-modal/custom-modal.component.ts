import { NgStyle } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss',
})
export class CustomModalComponent {
  title = input();
  options = input<{ optionName: string; optionColor: string }[]>();
  clickedOption = output<string>();

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
}
