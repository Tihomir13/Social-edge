import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewPostStateService {
  isCreatingNewPost = false;
  globalClickListener = signal<(() => void) | null>(null);

  isStatusPickerVisible: boolean = false;

  imagePreviews: string[] = [];

  currentStatus: string = '';

  errorMsgTag: string = '';
  errorMsgPhoto: string = '';

  toggleNewPost(value: boolean = !this.isCreatingNewPost) {
    this.isCreatingNewPost = value;
  }

  resetUI(): void {
    this.imagePreviews = [];
    this.currentStatus = '';
  }

  setGlobalClickListener(listener: () => void) {
    this.globalClickListener.set(listener);
  }

  removeGlobalClickListener(): void {
    if (this.globalClickListener()) {
      this.globalClickListener()!();
      this.globalClickListener.set(null);
    }
  }
}
