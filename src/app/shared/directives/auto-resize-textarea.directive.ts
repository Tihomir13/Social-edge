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
  private removeClickListener: (() => void) | null = null; // Запазваме референция към listener-а

  @HostListener('input') onInput(): void {
    this.resize();

    const textarea = this.element.nativeElement;
    if (textarea.value.trim() && !this.removeClickListener) {
      console.log('listner');
      // Добавяме event listener за клик само ако има текст
      this.removeClickListener = this.renderer.listen('document', 'click', (event: Event) => {
        if (!textarea.contains(event.target) && !textarea.value.trim()) {
          this.renderer.setStyle(textarea, 'height', 'auto');
          this.removeOutsideClickListener(); // Спираме да слушаме
        }
      });
    } else if (!textarea.value.trim()) {
      this.removeOutsideClickListener(); // Ако е празно, спираме да слушаме
    }
  }

  private resize(): void {
    const textarea = this.element.nativeElement;
    this.renderer.setStyle(textarea, 'height', '45px');
    this.renderer.setStyle(textarea, 'height', `${textarea.scrollHeight + 56}px`);
  }

  private removeOutsideClickListener(): void {
    
    if (this.removeClickListener) {
      const textarea = this.element.nativeElement;
      console.log('stop listner');
      this.removeClickListener(); // Премахваме listener-а
      this.removeClickListener = null;
      this.renderer.setStyle(textarea, 'height', '45px');
    }
  }
}
