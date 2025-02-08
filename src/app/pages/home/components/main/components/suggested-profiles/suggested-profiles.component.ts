import { Component } from '@angular/core';

import { FriendListUserCardComponent } from '../../shared/friend-list-user-card/friend-list-user-card.component';

@Component({
  selector: 'app-suggested-profiles',
  standalone: true,
  imports: [FriendListUserCardComponent],
  templateUrl: './suggested-profiles.component.html',
  styleUrl: './suggested-profiles.component.scss',
})
export class SuggestedProfilesComponent {
  suggestedProfiles: string[] = ['aaa', 'sss', 'ddd', 'aaa', 'sss'];
}
