import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FriendListUserCardComponent } from '../../shared/friend-list-user-card/friend-list-user-card.component';
import { MainStateService } from '../../shared/services/main-state.service';
import { MainSocketService } from '../../../../../../shared/services/websocket/main-socket.service';
import { UtilitySessionService } from '../../../../../../shared/services/utility/utility.service';
import { Subscription } from 'rxjs';
import { FriendListRequestsService } from './services/friend-list-requests.service';
import { NotificationsService } from '../../../header/components/notifications-window/services/notifications.service';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [SearchBarComponent, FriendListUserCardComponent],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss',
})
export class FriendListComponent {
  open = output<any>();
  subscription = new Subscription();

  mainState = inject(MainStateService);
  private statusSocketService = inject(MainSocketService);
  private utilitySession = inject(UtilitySessionService);
  private friendRequest = inject(FriendListRequestsService);
  private notificationService = inject(NotificationsService);

  username = this.utilitySession.userInfo.username;
  private statusInterval: any;
  currentFriends = signal<
    {
      username: string;
      isOnline: boolean;
      profileImage: { src: string; contentType: string;};
    }[]
  >([]);

  constructor() {
    effect(() => {
      const newValue = this.mainState.friends();
      this.currentFriends.set(newValue);
    });

    effect(() => {
      const refresh = this.notificationService.refreshFriends();

      this.subscription.add(
        this.friendRequest.getAllFriends(this.username).subscribe({
          next: (response) => {
            if (response.userFriends) {
              this.mainState.setFriends(response.userFriends);
            }
          },
          error: (error) => {
            console.log(error);
          },
        })
      );
    });
  }

  ngOnInit() {
    this.statusSocketService.sendStatus();

    this.statusInterval = setInterval(() => {
      this.statusSocketService.sendStatus();
      this.statusSocketService.getOnlineUsers();
    }, 3000);

    this.subscription.add(
      this.friendRequest.getAllFriends(this.username).subscribe({
        next: (response) => {
          if (response.userFriends) {
            this.mainState.setFriends(response.userFriends);
            this.statusSocketService.listenForUserStatus();

            console.log(response.userFriends);
          }
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  onSearch(value: string): void {
    this.currentFriends?.update((currFriends) => {
      return currFriends?.filter((friend) => friend.username.includes(value));
    });
  }

  onUserProfileClick(friend: any): void {
    this.open.emit(friend);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.statusInterval);
  }
}
