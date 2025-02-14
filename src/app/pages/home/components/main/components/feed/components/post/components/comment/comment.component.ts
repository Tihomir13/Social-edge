import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { TimeAgoPipe } from '../../../../../../../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-comment',
  imports: [SlicePipe, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  authorProfileImage = input();
  text = input<string>();
  username = input<string>();
  likes = input(0);
  date = input(new Date());

  isCollapsed = true;

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
