import { Component, inject, input, output } from '@angular/core';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { FriendListUserCardComponent } from '../../shared/friend-list-user-card/friend-list-user-card.component';
import { MainStateService } from '../../shared/services/main-state.service';

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

  currentFriends?: string[] = this.state.friends();

  onSearch(value: string): void {
    this.currentFriends = this.friends()?.filter((friend) =>
      friend.includes(value)
    );
  }

  onUserProfileClick(friend: any): void {
    this.open.emit(friend);
  }
}
