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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToxicityService } from '../../../../../../../../shared/services/AI/toxicity.service';

@Component({
  selector: 'app-comment',
  imports: [SlicePipe, TimeAgoPipe, FontAwesomeModule, OptionsMenuComponent, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  postId = input<string>();
  commentId = input<string>();

  authorProfileImage = input<any>();
  text = input<string>();
  currentText: string = "";
  username = input<string>();
  date = input(new Date());
  initialTotalLikes = input<number>(0);
  initialIsLiked = input<boolean>();
  createdAt = input();
  isLiked: boolean | undefined;
  totalLikes: number | undefined;

  subscriptions = new Subscription();


  isEditing = false;
  dotsIcon = faEllipsis;
  isMenuOpened = false;
  likeTimer: Subscription | null = null;
  isCollapsed = true;

  private unlistenOptionsMenu!: () => void;

  postRequests = inject(PostsRequestsService);
  utilitySessionService = inject(UtilitySessionService);
  toxicityService = inject(ToxicityService);
  mainState = inject(MainStateService);
  render = inject(Renderer2);
  fb = inject(FormBuilder);

  editCommentFormGroup!: FormGroup;

  ngOnInit(): void {
    this.currentText = this.text() ?? "";

    this.isLiked = this.initialIsLiked();
    this.totalLikes = this.initialTotalLikes();

    this.editCommentFormGroup = this.fb.group({
      text: this.fb.control(this.text()),
    });
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

  onEdit(): void {
    this.isMenuOpened = false;
    this.isEditing = !this.isEditing;
  }

  cancelEditMode(): void {
    this.isEditing = false;
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

  async onSaveNewComment(): Promise<void> {
    if (this.editCommentFormGroup.value.text === this.text() && !this.editCommentFormGroup.valid) {
      this.isEditing = false;
      return;
    }

    const isToxicNewText = await this.toxicityService.checkToxicText(this.editCommentFormGroup.value.text)

    if (isToxicNewText) {
      this.isEditing = false;
      return;
    }

    this.subscriptions.add(this.postRequests.editComment(this.postId()!, this.commentId()!, this.editCommentFormGroup.value.text).subscribe({
      next: (response) => {
        this.currentText = this.editCommentFormGroup.value.text;
        this.isEditing = false;
      },
      error: (error) => {
        console.log(error);
        this.isEditing = false;
      }
    }))
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
