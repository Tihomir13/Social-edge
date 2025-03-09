import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAutoResizeTextarea]',
})
export class AutoResizeTextareaDirective {
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input() minHeight: number = 40; // Минимална височина (по подразбиране 40px)
  @Input() maxHeight: number = 120; // Максимална височина (по подразбиране 120px)

  constructor() {
    setTimeout(() => {
      this.applyStyles();
    });
  }

  @HostListener('input') onInput(): void {
    this.resize();
  }

  private resize(): void {
    const textarea = this.element.nativeElement as HTMLTextAreaElement;
    
    this.renderer.setStyle(textarea, 'height', `${this.minHeight}px`);

    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, this.minHeight), this.maxHeight);

    this.renderer.setStyle(textarea, 'height', `${newHeight}px`);
    this.renderer.setStyle(
      textarea,
      'overflow-y',
      newHeight >= this.maxHeight ? 'auto' : 'hidden'
    );
  }

  private applyStyles(): void {
    const textarea = this.element.nativeElement as HTMLTextAreaElement;
    this.renderer.setStyle(textarea, 'height', `${this.minHeight}px`);
    this.renderer.setStyle(textarea, 'overflow', 'hidden');
  }
}
