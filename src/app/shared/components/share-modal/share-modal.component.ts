import { Component, HostListener, input, output, signal } from '@angular/core';
import { feApi } from '../../constants/api';

@Component({
  selector: 'app-share-modal',
  imports: [],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss',
})
export class ShareModalComponent {
  title = input();
  options = input<{ optionName: string; optionColor: string }[]>();
  private _loading = signal<{
    listElemIndex: number;
    isLoading: boolean;
  } | null>(null);
  clickedOption = output<string>();

  postId = input();

  link?: string;

  loading = this._loading.asReadonly();

  ngOnInit() {
    console.log(this.postId());

    this.link = `${feApi}/posts/${this.postId()}`;
  }

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
