import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { PostComponent } from '../../../feed/components/post/post.component';
import { ProfileRequestsService } from '../../services/profile-requests.service';
import { MainStateService } from '../../../../shared/services/main-state.service';
import { PostsRequestsService } from '../../../feed/components/post/services/posts-requests.service';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [PostComponent],
  providers: [HttpClient, ProfileRequestsService, PostsRequestsService],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss',
})
export class UserPostsComponent {
  subscriptions = new Subscription();
  posts = signal<any[] | null>(null);
  username: string | null = '';

  private profileRequestService = inject(ProfileRequestsService);
  mainState = inject(MainStateService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.username = this.route.parent?.snapshot.paramMap.get('username')!;

    this.getUserPosts();
  }

  getUserPosts(): void {
    if (!this.username) {
      return;
    }

    this.subscriptions.add(
      this.profileRequestService.getUserPosts(this.username).subscribe({
        next: (response: any) => {
          console.log(response);

          this.posts.set(response.posts);
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
