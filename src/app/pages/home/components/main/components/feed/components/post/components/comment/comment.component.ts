import { SlicePipe } from '@angular/common';
import { Component, inject, input, Renderer2 } from '@angular/core';

import { TimeAgoPipe } from '../../../../../../../../../../shared/pipes/time-ago.pipe';
import { MainStateService } from '../../../../../../shared/services/main-state.service';
import { Subscription, timer } from 'rxjs';
import { PostsRequestsService } from '../../services/posts-requests.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { OptionsMenuComponent } from './components/options-menu/options-menu.component';
import { UtilitySessionService } from '../../../../../../../../../../shared/services/utility/utility.service';

@Component({
  selector: 'app-comment',
  imports: [SlicePipe, TimeAgoPipe, FontAwesomeModule, OptionsMenuComponent],
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

  dotsIcon = faEllipsis;
  isMenuOpened = false;
  likeTimer: Subscription | null = null;
  isCollapsed = true;

  private unlistenOptionsMenu!: () => void;

  postRequests = inject(PostsRequestsService);
  utilitySessionService = inject(UtilitySessionService);
  mainState = inject(MainStateService);
  render = inject(Renderer2);

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

    // this.mainState.updateCommentLikeState(this.postId()!, this.commentId()!);

    // Стартираме нов таймер
    this.likeTimer = timer(5000).subscribe(() => {
      this.commentLikeDislike();
      this.likeTimer = null;
    });
  }

  toggleCommentMenu(): void {
    if (this.unlistenOptionsMenu) {
      this.unlistenOptionsMenu();
    }

    this.addListenerToOptionsMenu();
    this.isMenuOpened = !this.isMenuOpened;
  }

  addListenerToOptionsMenu(): void {
    this.unlistenOptionsMenu = this.render.listen(
      'document',
      'click',
      (event: Event) => {
        const target = event.target as HTMLElement;

        if (!target.closest('.options-container')) {
          this.isMenuOpened = false;
          this.unlistenOptionsMenu();
        }
      }
    );
  }


  async commentLikeDislike(): Promise<void> {
    try {
      await this.postRequests
        .likeComment(this.postId()!, this.commentId()!)
        .toPromise();

      this.mainState.posts.update((posts) =>
        posts.map((post) => {
          if (post._id !== this.postId()) return post;
          return {
            ...post,
            comments: post.comments.map((comment: any) => {
              if (comment.id === this.commentId()) {
                return {
                  ...comment,
                  isLiked: this.isLiked,
                  totalLikes: this.totalLikes,
                };
              }
              return comment;
            }),
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }
}
