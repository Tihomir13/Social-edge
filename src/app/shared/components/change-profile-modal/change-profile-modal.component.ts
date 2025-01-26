import { NgStyle } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-change-profile-modal',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './change-profile-modal.component.html',
  styleUrl: './change-profile-modal.component.scss',
})
export class ChangeProfileModalComponent {
  title = input('Change Profile Photo');
  // options = input<{ optionName: string; optionColor: string }[]>([]);
  clickedOption = output<string>();

  options: { optionName: string; optionColor: string }[] = [
    {
      optionName: 'Upload Photo',
      optionColor: 'rgb(143, 30, 255)',
    },
    {
      optionName: 'Remove Photo',
      optionColor: 'red',
    },
    {
      optionName: 'Cancel',
      optionColor: 'white',
    },
  ];

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
