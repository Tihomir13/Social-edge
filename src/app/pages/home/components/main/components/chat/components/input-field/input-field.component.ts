import { Component, ElementRef, ViewChild } from '@angular/core';

import { AutoResizeChatTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-chat-textarea.directive';

@Component({
  selector: 'app-input-field',
  imports: [AutoResizeChatTextareaDirective],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
})
export class InputFieldComponent {
  @ViewChild('textarea') textArea!: ElementRef;
}
