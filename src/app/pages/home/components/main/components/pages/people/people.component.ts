import { Component, inject } from '@angular/core';

import { UserBigCardComponent } from './components/user-big-card/user-big-card.component';
import { ProfileRequestsService } from '../profile/services/profile-requests.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  imports: [UserBigCardComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {
  subscription = new Subscription();

  items = [{ user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } }, { user: { username: 'isNotFriend' } },]

  private profileRequestService = inject(ProfileRequestsService);

  ngOnInit(): void {
    console.log('peoplessss');

    this.subscription.add(this.profileRequestService.getSuggestedProfiles().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
