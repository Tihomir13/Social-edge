import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  profileImg = input<string>();
  fullName = input<string>();
  username = input<string>();
  currUserProfileName = input<string>();
  isFriend = input<boolean>();
  isRequested = input<boolean>();

  clickProfile = output<string>();
  addFriend = output<string>();
  removeRequest = output<string>();

  onClick(): void {
    console.log(this.username());

    this.clickProfile.emit(this.username()!);
  }

  onAdd(): void {
    this.addFriend.emit(this.username()!);
  }

  onRemoveRequest(): void {
    this.removeRequest.emit(this.username()!);
  }
}
