import { Component, inject, input, output } from '@angular/core';

import { MainStateService } from '../../../../../../shared/services/main-state.service';

@Component({
  selector: 'app-options-menu',
  imports: [],
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss'
})
export class OptionsMenuComponent {
  isAuthor = input();
  
  profileState = inject(MainStateService);
  deletePost = output();

  onDeletePost(): void {
    this.deletePost.emit()
  }
}
