import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { PostComponent } from '../../../../feed/components/post/post.component';
import { ProfileRequestsService } from '../../services/profile-requests.service';
import { MainStateService } from '../../../../../shared/services/main-state.service';
import { PostsRequestsService } from '../../../../feed/components/post/services/posts-requests.service';
import { LoadingSpinnerComponent, size } from '../../../../../../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [PostComponent, LoadingSpinnerComponent],
  // providers: [HttpClient, ProfileRequestsService, PostsRequestsService],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss',
})
export class UserPostsComponent {
  subscriptions = new Subscription();

  posts = signal<any[]>([]);
  username: string | null = '';

  isLoadingPosts = false;
  nextCursor: string | null = null;

  enumLoadingSpinnerSize = size;

  private profileRequestService = inject(ProfileRequestsService);
  mainState = inject(MainStateService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    // this.username = this.route.parent?.snapshot.paramMap.get('username')!;


    this.subscriptions.add(
    this.route.parent!.params.subscribe(params => {
      this.username = params['username'];
      this.nextCursor = null;
      this.posts.set([]);
      this.getUserPosts();
    })
  );
    window.addEventListener('scroll', this.onWindowScroll);
  }

  onWindowScroll = (): void => {
    if (this.isOnBottom() && this.nextCursor && !this.isLoadingPosts) {
      this.getUserPosts();
    }
  }

  isOnBottom(): boolean {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    return scrollTop + windowHeight >= docHeight - 200;
  }

  getUserPosts(): void {
    if (!this.username) {
      return;
    }

    this.isLoadingPosts = true;

    this.subscriptions.add(
      this.profileRequestService.getUserPosts(this.username, this.nextCursor, 10).subscribe({
        next: (response: any) => {
          if (this.posts().length === 0) {
            this.posts.set(response.posts);
          }
          else {
            this.posts.update((currentPosts: any) => {
              return [...currentPosts, ...response.posts]
            })
          }

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
        },
      })
    );

    console.log(this.posts());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
