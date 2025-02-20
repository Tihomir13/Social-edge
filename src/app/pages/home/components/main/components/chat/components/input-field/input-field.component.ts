import {
  Component,
  ElementRef,
  inject,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { AutoResizeChatTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-chat-textarea.directive';

@Component({
  selector: 'app-input-field',
  imports: [AutoResizeChatTextareaDirective],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
})
export class InputFieldComponent {
  isTyping = false;
  onNewMessage = output();

  @ViewChild('textarea') textArea!: ElementRef;

  private unlisten: (() => void) | null = null;

  renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    if (this.textArea) {
      this.unlisten = this.renderer.listen(
        this.textArea.nativeElement,
        'input',
        (event) => {
          const value = (event.target as HTMLTextAreaElement).value.trim();
          this.isTyping = value.length > 0;
        }
      );
    }
  }

  sendMessage(): void {
    const message = this.renderer
      .selectRootElement(this.textArea.nativeElement)
      .value.trim();

    if (message.length === 0) {
      return;
    }

    this.renderer.setProperty(this.textArea.nativeElement, 'value', '');
    this.isTyping = false;

    this.onNewMessage.emit(message);
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }
  }
}
