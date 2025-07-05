import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';

import { MainStateService } from '../../../../../shared/services/main-state.service';
import { ProfileRequestsService } from '../../../profile/services/profile-requests.service';
import { MaxLengthPipe } from '../../../../../../../../../shared/pipes/max-length.pipe';

@Component({
  selector: 'app-user-big-card',
  imports: [RouterLink, MaxLengthPipe],
  templateUrl: './user-big-card.component.html',
  styleUrl: './user-big-card.component.scss',
})
export class UserBigCardComponent {
  mainState = inject(MainStateService);
  user = input<any>();

  username = output<string>();

  onAddFriendEmitter = output<string>();
  onRemoveFriendRequestEmitter = output<string>();

  subscriptions = new Subscription();

  isAddFriendDisabled = false;
  isRemoveFriendRequestDisabled = false;

  profileRequestService = inject(ProfileRequestsService)


  onAddFriend(): void {
    if (this.isAddFriendDisabled) return;
    this.isAddFriendDisabled = true;
    this.onAddFriendEmitter.emit(this.user().username);
    setTimeout(() => {
      this.isAddFriendDisabled = false;
    }, 1000);
  }

  onRemoveFriendRequest(): void {
    if (this.isRemoveFriendRequestDisabled) return;
    this.isRemoveFriendRequestDisabled = true;
    this.onRemoveFriendRequestEmitter.emit(this.user().username);
    setTimeout(() => {
      this.isRemoveFriendRequestDisabled = false;
    }, 1000);
  }
}
