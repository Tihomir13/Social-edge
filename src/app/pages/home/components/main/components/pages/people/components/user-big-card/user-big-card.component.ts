import { Component, inject, input } from '@angular/core';
import { MainStateService } from '../../../../../shared/services/main-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-big-card',
  imports: [RouterLink],
  templateUrl: './user-big-card.component.html',
  styleUrl: './user-big-card.component.scss',
})
export class UserBigCardComponent {
  userState? = input<string>();

  mainState = inject(MainStateService);
  user = input<any>();

  ngOnInit(): void {
    console.log(this.user());
  }

  onAddFriend(): void {}
  onRemoveFriendRequest(): void {}
  openModalRemoveFriend(): void {}
  acceptFriendRequest(): void {}
}
