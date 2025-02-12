import { Component, input } from '@angular/core';

import { ReplyModel } from '../../../../../../../../../../shared/interfaces/post';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  text = input<string>();
  username = input<string>();
  likes = input<string[]>([]);
  replies = input<ReplyModel[]>([]);

}
