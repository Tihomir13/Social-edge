import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchRequestsService } from './components/search-bar/services/search-requests.service';
import { MainStateService } from '../main/shared/services/main-state.service';
import { NotificationsWindowComponent } from './components/notifications-window/notifications-window.component';
import { NotificationsService } from './components/notifications-window/services/notifications.service';
import { ProfileRequestsService } from '../main/components/profile/services/profile-requests.service';
import { MainSocketService } from '../../../../shared/services/websocket/main-socket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, ProfileComponent, NotificationsWindowComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  defaultProfileImg = 'assets/images/default-images/profile-image.png';

  isScrolled = false;
  isNotificationsShowed = false;
  notifications: any = [];
  subscriptions = new Subscription();

  router = inject(Router);
  route = inject(ActivatedRoute);
  requestSearchService = inject(SearchRequestsService);
  requestNotificationsService = inject(NotificationsService);
  requestProfileService = inject(ProfileRequestsService);
  mainState = inject(MainStateService);
  private statusSocketService = inject(MainSocketService);

  ngOnInit(): void {
    this.getNotifications();
    this.getProfileImage();

    this.subscriptions.add(
      this.statusSocketService.onNewNotification().subscribe((notification) => {
        if (notification) {
          console.log('ss');
          console.log('New notification received:', notification);
          this.notifications.unshift(notification);
        }
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollPosition > 50;
  }

  navigateToFeed(): void {
    this.router.navigate(['feed']);
  }

  onSearch(value: any): void {
    this.router.navigate(['search'], { queryParams: { query: value } });

    this.subscriptions.add(
      this.requestSearchService.getSearchedProfiles(value).subscribe({
        next: (response) => {
          const users = response.users.map((user: any) => {
            if (user.profileImage === null) {
              user.profileImage = { src: this.defaultProfileImg };
            }
            return user;
          });
          console.log(users);

          this.mainState.setSearchedUsers(users);
        },
        error: (error) => {
          console.log(error);
          this.mainState.setSearchedUsers([]);
        },
      })
    );
  }

  onClickOutSideNotifications(): void {
    this.isNotificationsShowed = false;
  }

  toggleNotifications(): void {
    this.isNotificationsShowed = !this.isNotificationsShowed;
  }

  getNotifications(): void {
    this.subscriptions.add(
      this.requestNotificationsService.getNotifications().subscribe({
        next: (response) => {
          this.notifications = response.allNotifications;
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  getProfileImage(): void {
    this.subscriptions.add(
      this.requestProfileService.getProfileImage().subscribe({
        next: (response) => {
          if (response.profileImage) {
            this.mainState.setProfileImage(response.profileImage.src);
          }
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  friendRequestChose(notificationInfo: any) {
    if (notificationInfo.chose === 'accept') {
      this.subscriptions.add(
        this.requestProfileService
          .acceptFriendRequestById(notificationInfo.id)
          .subscribe({
            next: () => {
              this.removeNotificationById(notificationInfo.id);
              this.requestNotificationsService.triggerRefreshFriends();
            },
            error: (error) => {
              console.log(error);
            },
          })
      );
    }

    if (notificationInfo.chose === 'remove') {
      this.subscriptions.add(
        this.requestProfileService
          .removeFriendRequestById(notificationInfo.id)
          .subscribe({
            next: () => {
              this.removeNotificationById(notificationInfo.id);
            },
            error: (error) => {
              console.log(error);
            },
          })
      );
    }
  }

  removeNotificationById(id: string): void {
    this.notifications = this.notifications.filter(
      (notification: any) => notification._id !== id
    );
  }

  onDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
