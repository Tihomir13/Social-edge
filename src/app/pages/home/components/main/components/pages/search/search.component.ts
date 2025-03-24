import { Component, inject, OnInit } from '@angular/core';

import { UserCardComponent } from './components/user-card/user-card.component';
import { MainStateService } from '../../../shared/services/main-state.service';
import { Router } from '@angular/router';

import { UtilitySessionService } from '../../../../../../../shared/services/utility/utility.service';
import { Subscription } from 'rxjs';
import { ProfileRequestsService } from '../profile/services/profile-requests.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  mainState = inject(MainStateService);
  utility = inject(UtilitySessionService);
  router = inject(Router);
  profileRequestService = inject(ProfileRequestsService);
  subscriptions = new Subscription();

  onClickProfile(username: string): void {
    console.log(username);

    this.router.navigate(['profile', username, 'posts']);
  }

  onAddFriend(username: string): void {
    this.subscriptions.add(
      this.profileRequestService.addNewFriend(username).subscribe({
        next: (response) => {
          console.log(response);
          this.updateUserRequestStatus(username, true);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  onRemoveFriendRequest(username: string): void {
    this.subscriptions.add(
      this.profileRequestService
        .removeFriendRequestByUsername(username)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.updateUserRequestStatus(username, false);
          },
          error: (error) => {
            console.log(error);
          },
        })
    );
  }

  private updateUserRequestStatus(username: string, status: boolean) {
    this.mainState.searchedUsers.update((users) =>
      users.map((user) =>
        user.username === username ? { ...user, isRequestedBySender: status } : user
      )
    );
  }
}
