import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgClass, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription, timer } from 'rxjs';

import { imagePostModel } from './model/post.model';
import { PostsRequestsService } from './services/posts-requests.service';
import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';
import { GenerateCommentForm } from './helper/comment.form';
import { MainStateService } from '../../../../shared/services/main-state.service';
import { CommentComponent } from './components/comment/comment.component';
import { AutoResizeTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-textarea.directive';
import { PostModalComponent } from '../post-modal/post-modal.component';
import { OptionsMenuComponent } from './components/options-menu/options-menu.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    SlicePipe,
    ReactiveFormsModule,
    CommentComponent,
    AutoResizeTextareaDirective,
    NgClass,
    OptionsMenuComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [],
})
export class PostComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();

  isCommentsClicked: boolean = true;
  isCollapsed = true;
  isOptionsClicked = false;

  likeTimer: Subscription | null = null;

  postId = input<string>('');
  username = input<string>('');
  authorProfileImg = input<any>();
  title = input<string>('');
  text = input<string>('');
  tags = input<string[]>([]);
  likes = input<string[]>([]);
  images = input<imagePostModel[]>([]);
  comments = input<any[]>([]);
  totalCommentsCount = input<number>(0);
  currUserImg = input();
  totalLikes$ = input<number>();
  isLikedByCurrUser$ = input<boolean>();
  isLiked: boolean | undefined;
  totalLikes: number | undefined;

  private unlistenOptionsMenu!: () => void;

  @ViewChild('comment') comment!: ElementRef<HTMLTextAreaElement>;
  currentImageIndex = 0;

  commentFormGroup!: FormGroup;

  private postRequests = inject(PostsRequestsService);
  private render = inject(Renderer2);
  private el = inject(ElementRef);
  router = inject(Router);
  mainState = inject(MainStateService);
  utilityService = inject(UtilitySessionService);
  formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.isLiked = this.isLikedByCurrUser$();
    this.totalLikes = this.totalLikes$();

    this.commentFormGroup = new GenerateCommentForm(
      this.formBuilder
    ).generateCommentPost();
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

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleComments(): void {
    this.isCommentsClicked = !this.isCommentsClicked;
  }

  navigateToAuthorProfile(): void {
    this.router.navigate(['profile', this.username()]);
  }

  toggleLike() {
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

  openPostModal(): void {
    this.mainState.setOpenedPost(this.postId());
  }

  showMoreComments(): void {
    this.openPostModal();
  }

  onCancelComment(): void {
    this.commentFormGroup.reset();
    this.render.setStyle(this.comment.nativeElement, 'height', '45px');
  }

  addListenerToOptionsMenu(): void {
    this.unlistenOptionsMenu = this.render.listen('document', 'click', (event: Event) => {
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
    this.subscriptions.unsubscribe();

    if (this.unlistenOptionsMenu) {
      this.unlistenOptionsMenu();
    }
  }
}
