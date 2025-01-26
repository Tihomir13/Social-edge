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

  clickProfile = output<string>();

  onClick(): void {
    console.log(this.username());

    this.clickProfile.emit(this.username()!);
  }

  onAdd(): void {
    console.log(this.username());
  }
}
