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
import { StatusSocketService } from '../../../../../../shared/services/websocket/status-socket.service';
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
  currentFriends = signal<{ username: string; isOnline: boolean }[]>([]);

  constructor() {
    effect(() => {
      const newValue = this.state.friends(); // Взима текущата стойност на signalB
      this.currentFriends.set(newValue); // Задава я на signalA
    });
  }

  ngOnInit() {
    this.statusSocketService.sendStatus();

    this.statusInterval = setInterval(() => {
      this.statusSocketService.sendStatus();
      this.statusSocketService.getOnlineUsers();
    }, 30000);

    this.subscription.add(
      this.friendRequest.getAllFriends(this.username).subscribe({
        next: (response) => {
          if (response.userFriends) {
            this.state.setFriends(response.userFriends);
            this.statusSocketService.listenForUserStatus();
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
