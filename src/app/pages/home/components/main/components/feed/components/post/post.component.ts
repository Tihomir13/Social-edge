import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription, timer } from 'rxjs';

import { CommentsModel, imagePostModel } from './model/post.model';
import { PostsRequestsService } from './services/posts-requests.service';
import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';
import { GenerateCommentForm } from './helper/comment.form';
import { MainStateService } from '../../../../shared/services/main-state.service';
import { CommentComponent } from './components/comment/comment.component';
import { AutoResizeTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-textarea.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    SlicePipe,
    ReactiveFormsModule,
    CommentComponent,
    AutoResizeTextareaDirective,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [],
})
export class PostComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();

  isCommentsClicked: boolean = true;
  isCollapsed = true;

  likeTimer: Subscription | null = null;
  // currLikes = signal<number>(0);
  // localLikes: string[] = [];

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

  currentImageIndex = 0;

  comment: string = '';

  commentFormGroup!: FormGroup;

  private postRequests = inject(PostsRequestsService);
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

  postLikeDislike(): Promise<void> {
    return new Promise((_, reject) => {
      this.subscriptions.add(
        this.postRequests.likePost(this.postId()).subscribe({
          next: () => {},
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

  onCancelComment(): void {
    this.commentFormGroup.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
