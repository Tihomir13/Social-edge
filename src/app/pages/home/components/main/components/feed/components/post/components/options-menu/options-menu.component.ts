import { Component, output } from '@angular/core';

@Component({
  selector: 'app-options-menu',
  imports: [],
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss'
})
export class OptionsMenuComponent {
  deletePost = output();

  onDeletePost(): void {
    this.deletePost.emit()
  }
}
