import { Component, inject, input, output } from '@angular/core';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FriendListUserCardComponent } from '../../shared/friend-list-user-card/friend-list-user-card.component';
import { MainStateService } from '../../shared/services/main-state.service';
import { StatusSocketService } from '../../../../../../shared/services/status-socket.service';
import { UtilitySessionService } from '../../../../../../shared/services/utility/utility.service';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [SearchBarComponent, FriendListUserCardComponent],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss',
})
export class FriendListComponent {
  friends = input<string[]>();
  open = output<any>();

  state = inject(MainStateService);
  private statusSocketService = inject(StatusSocketService);
  private utilitySession = inject(UtilitySessionService);

  userId = this.utilitySession.userInfo.name._id;
  private statusInterval: any;
  currentFriends?: string[] = this.state.friends();

  onSearch(value: string): void {
    this.currentFriends = this.friends()?.filter((friend) =>
      friend.includes(value)
    );
  }

  onUserProfileClick(friend: any): void {
    this.open.emit(friend);
  }

  //

  constructor() {
    this.statusSocketService.sendStatus(this.userId);

    this.statusInterval = setInterval(() => {      
      this.statusSocketService.sendStatus(this.userId);
      this.statusSocketService.getOnlineUsers();
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.statusInterval);
  }
}
