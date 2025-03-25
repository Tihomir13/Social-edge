import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-big-card',
  imports: [],
  templateUrl: './user-big-card.component.html',
  styleUrl: './user-big-card.component.scss'
})
export class UserBigCardComponent {
  userState? = input<string>();
  user = input<any>({
    username: 'isNotFriend'
  });

  onAddFriend(): void {}
  onRemoveFriendRequest(): void {}
  openModalRemoveFriend(): void {}
  acceptFriendRequest(): void {}
}
