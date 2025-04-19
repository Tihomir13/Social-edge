import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainStateService } from '../home/components/main/shared/services/main-state.service';
import { PostModalComponent } from '../home/components/main/components/feed/components/post-modal/post-modal.component';

import { Subscription } from 'rxjs';

import { PostsRequestsService } from '../home/components/main/components/feed/components/post/services/posts-requests.service';

@Component({
  selector: 'app-blank',
  imports: [PostModalComponent],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss',
})
export class BlankComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  postParamId?: string;

  mainState = inject(MainStateService);
  route = inject(ActivatedRoute);
  postRequests = inject(PostsRequestsService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.postParamId = params.get('id')!;

      console.log(this.postParamId);

      this.subscriptions.add(
        this.postRequests.getPostById(this.postParamId).subscribe({
          next: (response) => {
            this.mainState.setOpenedPost(response.post, false);
          },
          error: (error) => {
            console.log(error);
          },
        })
      );

      console.log(this.mainState.openedPost());
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
