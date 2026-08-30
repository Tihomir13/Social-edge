import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, SlicePipe } from '@angular/common';

import { debounceTime, Subscription, timer } from 'rxjs';

import { MainStateService } from '../../../../shared/services/main-state.service';
import { CommentComponent } from '../post/components/comment/comment.component';
import { GenerateCommentForm } from '../post/helper/comment.form';
import { AutoResizeTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-textarea.directive';
import { PostsRequestsService } from '../post/services/posts-requests.service';
import { OptionsMenuComponent } from '../post/components/options-menu/options-menu.component';
import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';
import { CustomModalComponent } from '../../../../../../../../shared/components/custom-modal/custom-modal.component';
import { ShareModalComponent } from '../../../../../../../../shared/components/share-modal/share-modal.component';
import { TimeAgoPipe } from '../../../../../../../../shared/pipes/time-ago.pipe';
import { ToxicityService } from '../../../../../../shared/services/AI/toxicity.service';
import { commentsLimitPerFetch } from '../../../../../../../../shared/constants/settings';

@Component({
  selector: 'app-post-modal',
  imports: [
    SlicePipe,
    CommentComponent,
    ReactiveFormsModule,
    AutoResizeTextareaDirective,
    NgClass,
    OptionsMenuComponent,
    CustomModalComponent,
    ShareModalComponent,
    TimeAgoPipe,
  ],
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.scss',
})
export class PostModalComponent {
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

  postId = input<string>('');
  username = input<string>('');
  authorProfileImg = input<any>();
  title = input<string>('');
  text = input<string>('');
  tags = input<string[]>([]);
  likes = input<string[]>([]);
  images = input<any[]>([]);
  date = input<Date | string>(new Date());
  status = input<string>();
  initialComments = input<any[]>([]);
  comments = signal<any>([]);
  initialTotalCommentsCount = input<number>(0);
  totalCommentsCount = signal<number>(this.initialTotalCommentsCount());
  currUserImg = input();
  totalLikes$ = input<number>();
  isLikedByCurrUser$ = input<boolean>();
  createdAt = input();
  isClickOutsideOn = input<boolean>(false);

  get tagsArr(): FormArray {
    return this.editPostFormGroup?.get('tags') as FormArray;
  }

  get isLoggedIn(): boolean {
    return !!this.utilityService.userInfo;
  }

  errorMsgTag: string = '';

  commentsPageNum: number = 1;

  isLiked: boolean | undefined;
  totalLikes: number | undefined;

  postParamId?: string;

  isOptionsClicked = false;

  isDeletionModalOpened: boolean = false;
  isShareModalOpened: boolean = false;

  likeTimer: Subscription | null = null;
  isCollapsed = true;
  subscriptions = new Subscription();

  isLoadingComment = false;

  editPostFormGroup!: FormGroup;

  closeModal = output();

  private unlistenOptionsMenu!: () => void;
  private unlisten!: () => void;

  private renderer = inject(Renderer2);
  mainState = inject(MainStateService);
  utilityService = inject(UtilitySessionService);
  router = inject(Router);
  fb = inject(FormBuilder);
  private postRequests = inject(PostsRequestsService);
  private toxicityService = inject(ToxicityService);

  @ViewChild('comment') comment!: ElementRef<HTMLTextAreaElement>;
  currentImageIndex = 0;

  isOnMobile!: boolean;

  commentFormGroup!: FormGroup;

  ngOnInit(): void {
    this.comments.set(this.initialComments());
    this.totalCommentsCount.set(this.initialTotalCommentsCount());

    this.editPostFormGroup = this.fb.group({
      title: this.fb.control<string | null>(this.title()),
      text: this.fb.control<string | null>(this.text()),
      tags: this.fb.array<string>(this.tags()),
    });

    this.showMoreComments(true);

    if (this.isClickOutsideOn()) {
      this.unlisten = this.renderer.listen(
        'document',
        'click',
        (event: Event) => {
          const target = event.target as HTMLElement;

          if (!target.closest('.post-modal-container') && this.postId()) {
            this.mainState.closePost();
            this.unlisten();
          }
        }
      );
    }

    this.isLiked = this.isLikedByCurrUser$();
    this.totalLikes = this.totalLikes$();

    this.commentFormGroup = new GenerateCommentForm(
      this.fb
    ).generateCommentPost();

    this.isOnMobile = window.innerWidth <= 768;
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.totalLikes! += this.isLiked ? 1 : -1;

    const currPostId = this.postId();

    // Use debounceTime to handle the like action
    this.subscriptions.add(
      timer(5000)
        .pipe(debounceTime(2000))
        .subscribe(() => {
          this.postLikeDislike(currPostId);
        })
    );
  }

  postLikeDislike(postId: string): Promise<void> {
    return new Promise((_, reject) => {
      this.subscriptions.add(
        this.postRequests.likePost(postId).subscribe({
          next: () => {
            console.log(this.isLikedByCurrUser$());

            console.log(this.mainState.posts());
            this.mainState.posts.update((posts) =>
              posts.map((post) => {
                if (post._id === this.postId()) {
                  const wasLiked = post.isLiked;
                  return {
                    ...post,
                    isLiked: !wasLiked,
                    totalLikes: wasLiked
                      ? post.totalLikes - 1
                      : post.totalLikes + 1,
                  };
                } else {
                  return post;
                }
              })
            );
            console.log(this.mainState.posts());
          },
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

  showMoreComments(initial = false): void {
    this.subscriptions.add(
      this.postRequests
        .showMoreComments(
          this.postId(),
          this.commentsPageNum,
          commentsLimitPerFetch
        )
        .subscribe({
          next: (response: any) => {
            if (initial) {
              this.comments.set(response.comments);
            } else {
              this.comments.update((prevComments) => [
                ...prevComments,
                ...response.comments,
              ]);
            }
            this.commentsPageNum += 1;

            console.log(response);
          },
          error: (error) => {
            console.log(error);
          },
        })
    );
  }

  onCommentDelete(commentId: string): void {
    this.comments.update((comments) =>
      comments.filter((comment: any) => comment._id !== commentId)
    );
  }

  async onComment(): Promise<void> {
    if (this.isLoadingComment) {
      return;
    }

    this.isLoadingComment = true;

    const comment = this.commentFormGroup.value.comment.trim();

    const isCommentToxic = await this.toxicityService.checkToxicText(comment);

    if (isCommentToxic) {
      this.isLoadingComment = false;
      return;
    }

    if (this.commentFormGroup.valid) {
      this.subscriptions.add(
        this.postRequests.commentPost(comment, this.postId()).subscribe({
          next: (response) => {
            this.commentFormGroup.reset();
            console.log(response);

            this.mainState.addNewCommentToPost(
              this.postId(),
              response.formattedComment
            );

            this.comments.update((prevComments) => [
              response.formattedComment,
              ...prevComments,
            ]);

            this.totalCommentsCount.update((prevCount) => prevCount + 1);

            this.isLoadingComment = false;
          },
          error: (error) => {
            console.log(error);
            this.isLoadingComment = false;
          },
        })
      );
    }
  }

  onAddTag(tag: string): void {
    if (tag === '') {
      return;
    }

    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }

    if (this.tags().includes(tag)) {
      this.errorMsgTag = `You have already entered ${tag}.`;
      return;
    }

    if (this.errorMsgTag != '') {
      this.errorMsgTag = '';
    }

    this.tagsArr.push(this.fb.control(tag));
  }

  onRemoveTag(index: number): void {
    this.tagsArr.removeAt(index);
  }

  onCancelComment(): void {
    this.commentFormGroup.reset();
    this.renderer.setStyle(this.comment.nativeElement, 'height', '45px');
  }

  addListenerToOptionsMenu(): void {
    this.unlistenOptionsMenu = this.renderer.listen(
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
          console.log(response);

          this.mainState.deletePost(this.postId());
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.mainState.closePost();
        },
      })
    );
  }

  startEditPost() {
    this.mainState.openedPost.update((prevPost) => ({
      ...prevPost,
      isEditing: true,
    }));

    this.editPostFormGroup.patchValue({
      title: this.title(),
      text: this.text(),
      tags: this.tags(),
    });
  }

  cancelEditMode() {
    this.mainState.openedPost.update((prevPost) => ({
      ...prevPost,
      isEditing: false,
    }));
  }

  onKeyDown(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onComment();
    }
  }

  //TODO : fixing prepopulating
  async onSubmitEdit(): Promise<void> {
    const isTitleToxic = await this.toxicityService.checkToxicText(
      this.editPostFormGroup.get('title')!.value
    );

    if (isTitleToxic) {
      this.cancelEditMode();
      return;
    }

    const isTextToxic = await this.toxicityService.checkToxicText(
      this.editPostFormGroup.get('text')!.value
    );

    if (isTextToxic) {
      this.cancelEditMode();
      return;
    }

    for (const tag of this.tagsArr.controls) {
      const isTagToxic = await this.toxicityService.checkToxicText(tag.value);

      if (isTagToxic) {
        this.cancelEditMode();
        return;
      }
    }

    const formData = this.editPostFormGroup?.value;

    console.log(formData);

    this.subscriptions.add(
      this.postRequests.editPost(this.postId(), formData).subscribe({
        next: (response) => {
          this.cancelEditMode();

          // this.mainState.addNewPostToFeed(response.fetchedNewPost);

          this.mainState.openedPost.update((prevPost) => ({
            ...prevPost,
            title: formData.title,
            text: formData.text,
            tags: formData.tags,
          }));

          this.mainState.posts.update((posts) =>
            posts.map((post) => {
              if (post._id === this.postId()) {
                return {
                  ...post,
                  title: formData.title,
                  text: formData.text,
                  tags: formData.tags,
                };
              } else {
                return post;
              }
            })
          );
        },
        error: (error) => {
          console.error('Error saving post', error);
        },
        // complete: () => {
        //   this.resetPost();
        // },
      })
    );
  }

  showShareModal() {
    this.isShareModalOpened = true;
  }

  onChoseOptionProfile(modalOption: string): void {
    if (modalOption === 'Delete') {
      this.deletePost();
    }

    this.isDeletionModalOpened = false;
    this.isShareModalOpened = false;
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }

    this.subscriptions.unsubscribe();
  }
}
