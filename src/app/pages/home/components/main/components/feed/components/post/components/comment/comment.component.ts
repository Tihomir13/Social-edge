import { SlicePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { TimeAgoPipe } from '../../../../../../../../../../shared/pipes/time-ago.pipe';
import { MainStateService } from '../../../../../../shared/services/main-state.service';
import { Subscription, timer } from 'rxjs';
import { PostsRequestsService } from '../../services/posts-requests.service';

@Component({
  selector: 'app-comment',
  imports: [SlicePipe, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  postId = input<string>();
  commentId = input<string>();

  authorProfileImage = input<any>();
  text = input<string>();
  username = input<string>();
  date = input(new Date());
  initialTotalLikes = input<number>(0);
  initialIsLiked = input<boolean>();
  createdAt = input();
  isLiked: boolean | undefined;
  totalLikes: number | undefined;

  postRequests = inject(PostsRequestsService);

  likeTimer: Subscription | null = null;

  isCollapsed = true;

  mainState = inject(MainStateService);

  ngOnInit(): void {
    this.isLiked = this.initialIsLiked();
    this.totalLikes = this.initialTotalLikes();
  }

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleLike(): void {
    // Променяме UI веднага
    this.isLiked = !this.isLiked;
    this.totalLikes! += this.isLiked ? 1 : -1;

    // Ако има активен таймер за този пост – анулираме го
    if (this.likeTimer) {
      this.likeTimer.unsubscribe();
    }

    // Стартираме нов таймер
    this.likeTimer = timer(5000).subscribe(() => {
      this.postLikeDislike();
      this.likeTimer = null; // След изпращане на заявка нулираме таймера
    });
  }

  async postLikeDislike(): Promise<void> {
    try {
      await this.postRequests.likeComment(this.postId()!, this.commentId()!).toPromise();
    } catch (error) {
      console.error(error);
    }
  }
}
