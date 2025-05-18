import { Component, input, output } from '@angular/core';

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

  onEditPost() {
    this.editPost.emit();
  }

  onDeletePost(): void {
    this.deletePost.emit();
  }
}
