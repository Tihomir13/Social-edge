import { Component, inject, input, output } from '@angular/core';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FriendListUserCardComponent } from '../../shared/friend-list-user-card/friend-list-user-card.component';
import { MainStateService } from '../../shared/services/main-state.service';
import { StatusSocketService } from '../../../../../../shared/services/status-socket.service';
import { UtilitySessionService } from '../../../../../../shared/services/utility/utility.service';
import { Subscription } from 'rxjs';
import { FriendListRequestsService } from './services/friend-list-requests.service';

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

  state = inject(MainStateService);
  private statusSocketService = inject(StatusSocketService);
  private utilitySession = inject(UtilitySessionService);
  private friendRequest = inject(FriendListRequestsService);

  username = this.utilitySession.userInfo.username;
  private statusInterval: any;
  currentFriends?: string[] = this.state.friends();

  ngOnInit() {
    this.statusSocketService.sendStatus(this.username);

    this.statusInterval = setInterval(() => {
      this.statusSocketService.sendStatus(this.username);
      this.statusSocketService.getOnlineUsers();
    }, 3000);

    this.subscription.add(
      this.friendRequest.getAllFriends(this.username).subscribe({
        next: (response) => {
          if (response.userFriends) {
            this.state.setFriends(response.userFriends);
          }
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  onSearch(value: string): void {
    this.currentFriends = this.state
      .friends()
      ?.filter((friend) => friend.includes(value));
  }

  onUserProfileClick(friend: any): void {
    this.open.emit(friend);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.statusInterval);
  }
}
