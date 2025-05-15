import { Component, inject, OnInit, signal } from '@angular/core';

import { Subscription } from 'rxjs';

import { NewPostComponent } from './components/new-post/new-post.component';
import { PostComponent } from './components/post/post.component';
import { PostsRequestsService } from './components/post/services/posts-requests.service';
import { MainStateService } from '../../shared/services/main-state.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NewPostComponent, PostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  subscriptions = new Subscription();

  mainState = inject(MainStateService);
  private postRequests = inject(PostsRequestsService);

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.subscriptions.add(
      this.postRequests.getPosts().subscribe({
        next: (response: any) => {
          console.log(response.posts);
          this.mainState.setPosts(response.posts);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.mainState.setLoadingState('posts')
        }
      })
    );
  }

  onShowMoreComments(post: {postId: string; pageNum: number}): void {
    
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
