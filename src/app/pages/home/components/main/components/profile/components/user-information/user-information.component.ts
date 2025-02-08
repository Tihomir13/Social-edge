import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProfileRequestsService } from '../../services/profile-requests.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProfileStateService } from '../../services/profile-state.service';
import { InfoCardComponent } from '../user-information/info-card/info-card.component';
import { InfoCardSelectComponent } from './info-card-select/info-card-select.component';

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [InfoCardComponent, InfoCardSelectComponent],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss',
})
export class UserInformationComponent implements OnInit, OnDestroy {
  username: string | null = '';
  subscriptions = new Subscription();
  userInfo: any = {};

  private route = inject(ActivatedRoute);
  private requests = inject(ProfileRequestsService);
  state = inject(ProfileStateService);

  relationshipStatuses = [
    'Single',
    'In a relationship',
    'Engaged',
    'Married',
    'It’s complicated',
    'In an open relationship',
    'Separated',
    'Divorced',
    'Widowed',
  ];

  ngOnInit(): void {
    this.getUserInfo();
  }

  private setRelationship(userInfo: any): void {
    const id = userInfo.relationship;

    this.userInfo.relationship = this.relationshipStatuses[id];
  }

  getUserInfo(): void {
    this.username = this.route.parent?.snapshot.paramMap.get('username')!;

    if (!this.username) {
      return;
    }

    this.subscriptions.add(
      this.requests.getUserInfo(this.username).subscribe({
        next: (response) => {
          console.log(response);
          this.userInfo = response.userInfo;
          this.setRelationship(response.userInfo);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  onNewInfo(value: any): void {
    console.log(value);

    this.subscriptions.add(
      this.requests.addUserInfo(this.username, value).subscribe({
        next: (response) => {
          console.log(response);
          this.getUserInfo();
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
