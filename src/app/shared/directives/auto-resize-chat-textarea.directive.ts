import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAutoResizeChatTextarea]',
})
export class AutoResizeChatTextareaDirective {
  element = inject(ElementRef);
  renderer = inject(Renderer2);

  private readonly minHeight = 40; // Начална височина
  private maxHeight = 0; // Максимална височина (определя се динамично)

  constructor() {
    setTimeout(() => {
      const textarea = this.element.nativeElement as HTMLTextAreaElement;
      textarea.setAttribute('rows', '1'); // Задава началния брой редове на 1
      const lineHeight =
        parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
      this.maxHeight = this.minHeight + lineHeight * 3; // Ограничаваме до 4 реда
      this.renderer.setStyle(textarea, 'height', `${this.minHeight}px`);
      this.renderer.setStyle(textarea, 'overflow', 'hidden'); // Скрива скролбара докато няма нужда
    });
  }

  @HostListener('input') onInput(): void {
    this.resize();
  }

  private resize(): void {
    const textarea = this.element.nativeElement as HTMLTextAreaElement;
    this.renderer.setStyle(textarea, 'height', `${this.minHeight}px`); // Ресетира височината
    const scrollHeight = textarea.scrollHeight;

    if (scrollHeight > this.minHeight) {
      const newHeight = Math.min(scrollHeight, this.maxHeight);
      this.renderer.setStyle(textarea, 'height', `${newHeight}px`);
    }

    this.renderer.setStyle(
      textarea,
      'overflow-y',
      textarea.scrollHeight >= this.maxHeight ? 'auto' : 'hidden'
    );
  }
}
