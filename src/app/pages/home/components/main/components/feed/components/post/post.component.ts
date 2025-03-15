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

import { debounceTime, Subscription, timer } from 'rxjs';

import { imagePostModel } from './model/post.model';
import { PostsRequestsService } from './services/posts-requests.service';
import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';
import { GenerateCommentForm } from './helper/comment.form';
import { MainStateService } from '../../../../shared/services/main-state.service';
import { CommentComponent } from './components/comment/comment.component';
import { AutoResizeTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-textarea.directive';
import { OptionsMenuComponent } from './components/options-menu/options-menu.component';
import { PostMethodsService } from './services/post-methods.service';
import { CustomModalComponent } from '../../../../../../../../shared/components/custom-modal/custom-modal.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    SlicePipe,
    ReactiveFormsModule,
    CommentComponent,
    AutoResizeTextareaDirective,
    NgClass,
    OptionsMenuComponent,
    CustomModalComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [],
})
export class PostComponent implements OnInit, OnDestroy {
  modalOptions = [
    {
      optionName: 'Delete',
      optionColor: 'red',
    },
    {
      optionName: 'Cancel',
      optionColor: 'white',
    },
  ];

  subscriptions = new Subscription();

  isCommentsClicked: boolean = true;
  isDeletionModalOpened: boolean = false;
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
  private postMethod = inject(PostMethodsService);
  private render = inject(Renderer2);
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
    this.isLiked = !this.isLiked;
    this.totalLikes! += this.isLiked ? 1 : -1;

    const currPostId = this.postId();

    // Use debounceTime to handle the like action
    this.subscriptions.add(
      timer(5000)
        .pipe(debounceTime(5000))
        .subscribe(() => {
          this.postLikeDislike(currPostId);
        })
    );
  }

  async postLikeDislike(postId: string): Promise<void> {
    try {
      await this.postRequests.likePost(postId).toPromise();
    } catch (error) {
      console.error(error);
    }
  }

  onComment(): void {
    const comment = this.commentFormGroup.value.comment.trim();

    if (this.commentFormGroup.valid) {
      this.subscriptions.add(
        this.postRequests.commentPost(comment, this.postId()).subscribe({
          next: (response) => {
            this.commentFormGroup.reset();
            this.mainState.addNewCommentToPost(
              this.postId(),
              response.formattedComment
            );
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
    this.subscriptions.add(
      this.postRequests.getPostById(this.postId()).subscribe({
        next: (response) => {
          this.mainState.setOpenedPost(response.post);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  showMoreComments(): void {
    this.openPostModal();
  }

  onCancelComment(): void {
    this.commentFormGroup.reset();
    this.render.setStyle(this.comment.nativeElement, 'height', '45px');
  }

  addListenerToOptionsMenu(): void {
    this.unlistenOptionsMenu = this.render.listen(
      'document',
      'click',
      (event: Event) => {
        const target = event.target as HTMLElement;

        if (!target.closest('.options-container')) {
          this.isOptionsClicked = false;
          this.unlistenOptionsMenu();
        }
      }
    );
  }

  toggleOptionsMenu(): void {
    if (this.unlistenOptionsMenu) {
      this.unlistenOptionsMenu();
    }

    this.addListenerToOptionsMenu();
    this.isOptionsClicked = !this.isOptionsClicked;
  }

  deletePost(): void {
    this.subscriptions.add(
      this.postRequests.deletePost(this.postId()).subscribe({
        next: (response) => {
          this.mainState.deletePost(this.postId());
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  onChoseOptionProfile(modalOption: string): void {
    if (modalOption === 'Delete') {
      this.deletePost();
    }

    this.isDeletionModalOpened = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.unlistenOptionsMenu) {
      this.unlistenOptionsMenu();
    }
  }
}
