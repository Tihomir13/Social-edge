import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAutoResizeTextarea]',
})
export class AutoResizeTextareaDirective {
  element = inject(ElementRef);
  renderer = inject(Renderer2);

  private maxHeight: number = 0;
  private removeClickListener: (() => void) | null = null;

  constructor() {
    setTimeout(() => {
      const textarea = this.element.nativeElement as HTMLTextAreaElement;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
      this.maxHeight = lineHeight * 4 + 32; // 4 реда + padding
    });
  }

  @HostListener('input') onInput(): void {
    this.resize();

    const textarea = this.element.nativeElement;
    if (textarea.value.trim() && !this.removeClickListener) {
      this.removeClickListener = this.renderer.listen('document', 'click', (event: Event) => {
        if (!textarea.contains(event.target) && !textarea.value.trim()) {
          this.renderer.setStyle(textarea, 'height', 'auto');
          this.removeOutsideClickListener();
        }
      });
    } else if (!textarea.value.trim()) {
      this.removeOutsideClickListener();
    }
  }

  private resize(): void {
    const textarea = this.element.nativeElement as HTMLTextAreaElement;
    this.renderer.setStyle(textarea, 'height', '45px');

    // Проверяваме височината
    const newHeight = textarea.scrollHeight + 32;
    if (newHeight <= this.maxHeight) {
      this.renderer.setStyle(textarea, 'height', `${newHeight}px`);
      this.renderer.setStyle(textarea, 'overflow-y', 'hidden');
    } else {
      this.renderer.setStyle(textarea, 'height', `${this.maxHeight}px`);
      this.renderer.setStyle(textarea, 'overflow-y', 'auto');
    }
  }

  private removeOutsideClickListener(): void {
    if (this.removeClickListener) {
      this.removeClickListener();
      this.removeClickListener = null;
      this.renderer.setStyle(this.element.nativeElement, 'height', '45px');
    }
  }
}
