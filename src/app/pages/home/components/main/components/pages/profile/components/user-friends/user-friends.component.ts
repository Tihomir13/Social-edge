import { Component, inject, signal } from '@angular/core';
import { UserBigCardComponent } from '../../../people/components/user-big-card/user-big-card.component';
import { Subscription } from 'rxjs';
import { ProfileRequestsService } from '../../services/profile-requests.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-friends',
  standalone: true,
  imports: [UserBigCardComponent],
  templateUrl: './user-friends.component.html',
  styleUrl: './user-friends.component.scss',
})
export class UserFriendsComponent {
  subscriptions = new Subscription();

  people = signal<any>([]);
  username: any;

  private profileRequestService = inject(ProfileRequestsService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.username = this.route.parent?.snapshot.paramMap.get('username')!;

    this.subscriptions.add(
      this.profileRequestService.getUserFriends(this.username).subscribe({
        next: (response) => {
          console.log(response);
          this.people.set(response.friends);
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
        user.username === username
          ? { ...user, isRequestedBySender: status }
          : user
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
