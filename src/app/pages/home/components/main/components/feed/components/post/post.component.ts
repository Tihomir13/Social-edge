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

import { Subscription } from 'rxjs';

import { CommentsModel, imagePostModel } from './model/post.model';
import { PostsRequestsService } from './services/posts-requests.service';
import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';
import { GenerateCommentForm } from './helper/comment.form';
import { MainStateService } from '../../../../shared/services/main-state.service';
import { CommentComponent } from './components/comment/comment.component';
import { AutoResizeTextareaDirective } from '../../../../../../../../shared/directives/auto-resize-textarea.directive';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [SlicePipe, ReactiveFormsModule, CommentComponent, AutoResizeTextareaDirective],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [],
})
export class PostComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();

  isCommentsClicked: boolean = true;
  isCollapsed = true;

  currLikes = signal<number>(0);
  localLikes: string[] = [];

  postId = input<string>('');
  username = input<string>('');
  authorProfileImg = input();
  title = input<string>('');
  text = input<string>('');
  tags = input<string[]>([]);
  likes = input<string[]>([]);
  images = input<imagePostModel[]>([]);
  comments = input<any[]>([]);
  totalCommentsCount = input<number>(0);
  currUserImg = input();

  currentImageIndex = 0;

  comment: string = '';

  commentFormGroup!: FormGroup;

  private postRequests = inject(PostsRequestsService);
  mainState = inject(MainStateService);
  utilityService = inject(UtilitySessionService);
  formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.localLikes = [...this.likes()];
    this.currLikes.set(this.localLikes.length);

    this.commentFormGroup = new GenerateCommentForm(
      this.formBuilder
    ).generateCommentPost();


    console.log(this.comments());
    
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images().length - 1) {
      this.currentImageIndex++;
    }

    console.log('Current Index:', this.currentImageIndex);
    console.log('Images:', this.images());
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }

    console.log('Current Index:', this.currentImageIndex);
    console.log('Images:', this.images());
  }

  toggleReadMore(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleComments(): void {
    this.isCommentsClicked = !this.isCommentsClicked;
  }

  async toggleLike(): Promise<any> {
    const username = this.utilityService.userInfo.username;

    if (this.localLikes.includes(username)) {
      const newLikes = this.localLikes.filter((user) => user !== username);
      this.currLikes.set(this.currLikes() - 1);
      this.localLikes = newLikes;
    } else {
      this.localLikes.push(username);
      this.currLikes.set(this.currLikes() + 1);
    }

    try {
      await this.postLikeDislike();
    } catch (error) {
      console.log('Error syncing with server:', error);
    }
  }

  postLikeDislike(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscriptions.add(
        this.postRequests.likePost(this.postId()).subscribe({
          next: (response) => {
            console.log(response.likes);
            this.currLikes.set(response.likes.length);
            resolve(response);
          },
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
