import { Component, input } from '@angular/core';

@Component({
  selector: 'app-friend-list-user-card',
  standalone: true,
  imports: [],
  templateUrl: './friend-list-user-card.component.html',
  styleUrl: './friend-list-user-card.component.scss',
})
export class FriendListUserCardComponent {
  username = input<string>();
  isOnline = input<boolean>(false);
}
