import { Component, inject, input, output } from '@angular/core';
import { MainStateService } from '../../../../../../shared/services/main-state.service';

@Component({
  selector: 'app-options-menu',
  imports: [],
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss',
})
export class OptionsMenuComponent {
  isAuthor = input();

  deletePost = output();
  editPost = output();

  mainState = inject(MainStateService)

  cancelEditMode() {
    this.mainState.openedPost.update((prevPost) => ({
      ...prevPost,
      isEditing: false,
    }));
  }

  toggleEdit() {
    if (!this.mainState.openedPost()) {
      this.editPost.emit();
      return;
    }

    if (!this.mainState.openedPost() && !this.mainState.openedPost().isEditing) {
      this.editPost.emit();
      return;
    }

    if (this.mainState.openedPost() && !this.mainState.openedPost().isEditing) {
      this.editPost.emit();
      return;
    }

    if (this.mainState.openedPost() && this.mainState.openedPost().isEditing) {
      this.cancelEditMode()
      return;
    }
  }

  onDeletePost(): void {
    this.deletePost.emit();
  }
}
