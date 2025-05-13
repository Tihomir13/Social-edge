import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MainStateService } from '../../../../../shared/services/main-state.service';
import { ProfileRequestsService } from '../../../profile/services/profile-requests.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-big-card',
  imports: [RouterLink],
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

  profileRequestService = inject(ProfileRequestsService)

  ngOnInit(): void {
    console.log(this.user());
  }

  onAddFriend(): void {
    console.log(this.user().username);
    this.onAddFriendEmitter.emit(this.user().username)
  }
  
  onRemoveFriendRequest(): void {
    console.log(this.user().username);
    this.onRemoveFriendRequestEmitter.emit(this.user().username)
  }
}
