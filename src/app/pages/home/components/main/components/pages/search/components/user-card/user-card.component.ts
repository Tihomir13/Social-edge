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

  clickProfile = output<string>();

  onClick(): void {
    console.log(this.username());

    this.clickProfile.emit(this.username()!);
  }

  onAdd(): void {
    
  }

  // onAddFriend(): void {
  //   this.subscriptions.add(
  //     this.profileRequestService.addNewFriend(this.username).subscribe({
  //       next: (response) => {
  //         console.log(response);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     })
  //   );
  // }
}
