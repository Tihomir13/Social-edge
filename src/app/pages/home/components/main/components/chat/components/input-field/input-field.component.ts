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
  sendSparkle = output();

  @ViewChild('textarea') textArea!: ElementRef;

  private unlisten: (() => void) | null = null;
  private unlistenKeydown: (() => void) | null = null;

  renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    if (this.textArea) {
      this.renderer.setProperty(this.textArea.nativeElement, 'value', '');

      this.unlisten = this.renderer.listen(
        this.textArea.nativeElement,
        'input',
        (event) => {
          const value = (event.target as HTMLTextAreaElement).value.trim();
          this.isTyping = value.length > 0;

          console.log(event);
          
        }
      );

      this.unlistenKeydown = this.renderer.listen(
        this.textArea.nativeElement,
        'keydown',
        (event: KeyboardEvent) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Предотвратява добавянето на нов ред
            this.sendMessage();
          }
        }
      );
    }
  }

  sendLike(): void {
    this.sendSparkle.emit();
  }

  sendMessage(): void {
    const message = this.renderer
      .selectRootElement(this.textArea.nativeElement)
      .value.trim();

    if (message.length === 0) {
      return;
    }

    this.renderer.setProperty(this.textArea.nativeElement, 'value', '');
    this.renderer.setAttribute(this.textArea.nativeElement, 'height', '40px');
    this.isTyping = false;

    this.onNewMessage.emit(message);
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }

    if (this.unlistenKeydown) {
      this.unlistenKeydown();
      this.unlistenKeydown = null;
    }
  }
}
