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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-modal',
  imports: [
    SlicePipe,
    CommentComponent,
    ReactiveFormsModule,
    AutoResizeTextareaDirective,
    NgClass,
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

  isCollapsed = true;
  subscriptions = new Subscription();

  closeModal = output();

  private unlisten!: () => void;

  private renderer = inject(Renderer2);
  mainState = inject(MainStateService);
  router = inject(Router);
  fb = inject(FormBuilder);
  private postRequests = inject(PostsRequestsService);

  @ViewChild('comment') comment!: ElementRef<HTMLTextAreaElement>;
  currentImageIndex = 0;

  commentFormGroup!: FormGroup;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.post-modal-container')) {
      this.mainState.setOpenedPost(null);
    }
  }

  ngOnInit(): void {
    this.isLiked = this.isLikedByCurrUser$();
    this.totalLikes = this.totalLikes$();

    this.commentFormGroup = new GenerateCommentForm(
      this.fb
    ).generateCommentPost();
  }

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images().length - 1) {
      this.currentImageIndex++;
    }

    console.log(this.images()[this.currentImageIndex]);
    console.log(this.currentImageIndex);
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  navigateToAuthorProfile(): void {
    this.router.navigate(['profile', this.username()]);
  }

  showMoreComments(): void {}

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

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }

    this.subscriptions.unsubscribe();
  }
}
