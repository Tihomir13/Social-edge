import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { NewPostComponent } from './components/new-post/new-post.component';
import { PostComponent } from './components/post/post.component';
import { PostsRequestsService } from './components/post/services/posts-requests.service';
import { MainStateService } from '../../shared/services/main-state.service';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { postsLimitPerFetch } from '../../../../../../shared/constants/settings';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NewPostComponent, PostComponent, LoadingSpinnerComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  subscriptions = new Subscription();

  isLoadingPosts: boolean = false;
  nextCursor: string | null = null;

  mainState = inject(MainStateService);
  private postRequests = inject(PostsRequestsService);

  ngOnInit(): void {
    this.getInitialPosts();
    window.addEventListener('scroll', this.onWindowScroll);
  }

  onWindowScroll = (): void => {
    if (this.isOnBottom() && this.nextCursor && !this.isLoadingPosts) {
      this.getPosts();
    }
  }

  isOnBottom(): boolean {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    return scrollTop + windowHeight >= docHeight - 200;
  }

  getInitialPosts(): void {
    this.isLoadingPosts = true;

    this.subscriptions.add(
      this.postRequests.getPosts(this.nextCursor, postsLimitPerFetch).subscribe({
        next: (response: any) => {
          this.mainState.setPosts(response.posts);

          if (response.nextCursor) {
            this.nextCursor = response.nextCursor;
          } else if (response.posts && response.posts.length > 0) {
            this.nextCursor = response.posts[response.posts.length - 1].id;
          } else {
            this.nextCursor = null;
          }

          this.isLoadingPosts = false;
        },
        error: (error) => {
          console.log(error);

          this.isLoadingPosts = false;
        },
        complete: () => {
          this.mainState.setLoadingState('posts')
        }
      })
    );
  }

  getPosts(): void {
    this.isLoadingPosts = true;

    this.subscriptions.add(
      this.postRequests.getPosts(this.nextCursor, postsLimitPerFetch).subscribe({
        next: (response: any) => {
          console.log(response.posts);
          this.mainState.updatePosts(response.posts);

          if (response.nextCursor) {
            this.nextCursor = response.nextCursor;
          } else if (response.posts && response.posts.length > 0) {
            this.nextCursor = response.posts[response.posts.length - 1].id;
          } else {
            this.nextCursor = null;
          }

          this.isLoadingPosts = false;
        },
        error: (error) => {
          console.log(error);

          this.isLoadingPosts = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}