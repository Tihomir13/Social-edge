import { Component, inject, signal } from '@angular/core';

import { UserBigCardComponent } from './components/user-big-card/user-big-card.component';
import { ProfileRequestsService } from '../profile/services/profile-requests.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  imports: [UserBigCardComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
})
export class PeopleComponent {
  subscriptions = new Subscription();

  people = signal<any>([]);

  private profileRequestService = inject(ProfileRequestsService);

  ngOnInit(): void {
    this.subscriptions.add(
      this.profileRequestService.getSuggestedProfiles().subscribe({
        next: (response) => {
          console.log(response);
          this.people.set(response.users);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
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
    this.people.update((users) =>
      users.map((user: any) =>
        user.username === username ? { ...user, isRequestedBySender: status } : user
      )
    );
  }

  // acceptFriendRequest(): void {
  //   const notifications = this.mainState.notifications();
  //   console.log(notifications);

  //   const notification = notifications.find(
  //     (notification) => notification.sender === this.user().username
  //   );

  //   this.subscriptions.add(
  //     this.profileRequestService
  //       .acceptFriendRequestById(notification._id)
  //       .subscribe({
  //         next: (response) => {
  //           this.profileRequestService.getInitialUserData(this.user().username!);
  //         },
  //         error: (error) => {
  //           console.log(error);
  //         },
  //       })
  //   );
  // }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
