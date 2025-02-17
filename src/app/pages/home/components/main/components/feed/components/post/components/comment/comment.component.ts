import { SlicePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { TimeAgoPipe } from '../../../../../../../../../../shared/pipes/time-ago.pipe';
import { MainStateService } from '../../../../../../shared/services/main-state.service';

@Component({
  selector: 'app-comment',
  imports: [SlicePipe, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  authorProfileImage = input<any>();
  text = input<string>();
  username = input<string>();
  likes = input(0);
  date = input(new Date());
  
  isCollapsed = true;

  mainState = inject(MainStateService);

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
