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
  totalLikes$ = input<number>();
  isLikedByCurrUser$ = input<boolean>();
  createdAt = input();
  isLiked: boolean | undefined;
  totalLikes: number | undefined;
  
  isCollapsed = true;

  mainState = inject(MainStateService);

  ngOnInit(): void {
    this.isLiked = this.isLikedByCurrUser$();
    this.totalLikes = this.totalLikes$();
  }

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // toggleLike(): void {
  //     // Променяме UI веднага
  //     this.isLiked = !this.isLiked;
  //     this.totalLikes! += this.isLiked ? 1 : -1;
  
  //     const currPostId = this.postId();
  
  //     // Ако има активен таймер за този пост – анулираме го
  //     if (this.likeTimer) {
  //       this.likeTimer.unsubscribe();
  //     }
  
  //     // Стартираме нов таймер
  //     this.likeTimer = timer(5000).subscribe(() => {
  //       this.postLikeDislike(currPostId);
  //       this.likeTimer = null; // След изпращане на заявка нулираме таймера
  //     });
  //   }
}
