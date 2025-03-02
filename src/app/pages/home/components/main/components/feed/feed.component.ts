import { Component, inject, OnInit, signal } from '@angular/core';

import { Subscription } from 'rxjs';

import { NewPostComponent } from './components/new-post/new-post.component';
import { PostComponent } from './components/post/post.component';
import { PostsRequestsService } from './components/post/services/posts-requests.service';
import { MainStateService } from '../../shared/services/main-state.service';
import { PostModalComponent } from './components/post-modal/post-modal.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NewPostComponent, PostComponent, PostModalComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  subscriptions = new Subscription();

  state = inject(MainStateService);
  private postRequests = inject(PostsRequestsService);

  ngOnInit(): void {
    this.getPosts();
  }

  onNewPost(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.subscriptions.add(
      this.postRequests.getPosts().subscribe({
        next: (response: any) => {
          console.log(response.posts);
          this.state.setPosts(response.posts);
          console.log(this.state.posts());
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
