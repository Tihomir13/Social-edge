import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { NgClass, SlicePipe } from '@angular/common';

import { MainStateService } from '../../../../shared/services/main-state.service';
import { CommentComponent } from '../post/components/comment/comment.component';
import { GenerateCommentForm } from '../post/helper/comment.form';
import { AutoResizeTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-textarea.directive';
import { PostsRequestsService } from '../post/services/posts-requests.service';
import { Subscription, timer } from 'rxjs';
import { OptionsMenuComponent } from '../post/components/options-menu/options-menu.component';
import { UtilityService } from '../../../../../../../../shared/services/utility/array-utility.service';
import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';

@Component({
  selector: 'app-post-modal',
  imports: [
    SlicePipe,
    CommentComponent,
    ReactiveFormsModule,
    AutoResizeTextareaDirective,
    NgClass,
    OptionsMenuComponent
  ],
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.scss',
})
export class PostModalComponent {
  postId = input<string>('');
  username = input<string>('');
  authorProfileImg = input<any>();
  title = input<string>('');
  text = input<string>('');
  tags = input<string[]>([]);
  likes = input<string[]>([]);
  images = input<any[]>([]);
  comments = input<any[]>([]);
  totalCommentsCount = input<number>(0);
  currUserImg = input();
  totalLikes$ = input<number>();
  isLikedByCurrUser$ = input<boolean>();
  createdAt = input();
  isLiked: boolean | undefined;
  totalLikes: number | undefined;

  isOptionsClicked = false;

  likeTimer: Subscription | null = null;
  isCollapsed = true;
  subscriptions = new Subscription();

  closeModal = output();

  private unlistenOptionsMenu!: () => void;
  private unlisten!: () => void;

  private renderer = inject(Renderer2);
  mainState = inject(MainStateService);
  utilityService = inject(UtilitySessionService);
  router = inject(Router);
  fb = inject(FormBuilder);
  private postRequests = inject(PostsRequestsService);

  @ViewChild('comment') comment!: ElementRef<HTMLTextAreaElement>;
  currentImageIndex = 0;

  commentFormGroup!: FormGroup;

  ngOnInit(): void {
    this.unlisten = this.renderer.listen('document', 'click', (event: Event) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.post-modal-container') && this.postId()) {
        this.mainState.closePost();
        this.unlisten();
      }
    });

    this.isLiked = this.isLikedByCurrUser$();
    this.totalLikes = this.totalLikes$();

    this.commentFormGroup = new GenerateCommentForm(
      this.fb
    ).generateCommentPost();
  }

  toggleLike(): void {
    // Променяме UI веднага
    this.isLiked = !this.isLiked;
    this.totalLikes! += this.isLiked ? 1 : -1;

    const currPostId = this.postId();

    // Ако има активен таймер за този пост – анулираме го
    if (this.likeTimer) {
      this.likeTimer.unsubscribe();
    }

    // Стартираме нов таймер
    this.likeTimer = timer(5000).subscribe(() => {
      this.postLikeDislike(currPostId);
      this.likeTimer = null; // След изпращане на заявка нулираме таймера
    });
  }

  postLikeDislike(postId: string): Promise<void> {
    return new Promise((_, reject) => {
      this.subscriptions.add(
        this.postRequests.likePost(postId).subscribe({
          next: () => { },
          error: (error) => {
            console.log(error);
            reject(error);
          },
        })
      );
    });
  }

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images().length - 1) {
      this.currentImageIndex++;
    }

  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  navigateToAuthorProfile(): void {
    this.router.navigate(['profile', this.username()]);
  }

  showMoreComments(): void { }

  onComment(): void {
    const comment = this.commentFormGroup.value.comment.trim();

    if (this.commentFormGroup.valid) {
      this.subscriptions.add(
        this.postRequests.commentPost(comment, this.postId()).subscribe({
          next: (response) => {
            this.commentFormGroup.reset();
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          },
        })
      );
    }
  }

  onCancelComment(): void {
    this.commentFormGroup.reset();
    this.renderer.setStyle(this.comment.nativeElement, 'height', '45px');
  }

  addListenerToOptionsMenu(): void {
    this.unlistenOptionsMenu = this.renderer.listen('document', 'click', (event: Event) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.options-container')) {
        this.isOptionsClicked = false;
        this.unlistenOptionsMenu();
      }
    });
  }

  toggleOptionsMenu(): void {
    if (this.unlistenOptionsMenu) {
      this.unlistenOptionsMenu();
    }

    this.addListenerToOptionsMenu();
    this.isOptionsClicked = !this.isOptionsClicked;
  }

  deletePost(postId: string): void {
    this.subscriptions.add(this.postRequests.deletePost(postId).subscribe({
      next: (response) => {
        console.log(response);

        this.mainState.deletePost(this.postId());
      },
      error: (error) => {
        console.log(error);
      }
    }))
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }

    this.subscriptions.unsubscribe();
  }
}
