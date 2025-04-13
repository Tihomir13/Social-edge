import { Component, inject, signal } from '@angular/core';

import { UserBigCardComponent } from './components/user-big-card/user-big-card.component';
import { ProfileRequestsService } from '../profile/services/profile-requests.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  imports: [UserBigCardComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
})
export class PeopleComponent {
  subscription = new Subscription();

  people = signal([]);
  // items = [{ user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } },]

  private profileRequestService = inject(ProfileRequestsService);

  ngOnInit(): void {
    this.subscription.add(
      this.profileRequestService.getSuggestedProfiles().subscribe({
        next: (response) => {
          console.log(response);
          this.people.set(response.users);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
