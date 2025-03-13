import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';

import { TimeAgoPipe } from '../../../../../../shared/pipes/time-ago.pipe';
import { MainStateService } from '../../../main/shared/services/main-state.service';
import { getUsernameFromNotificationContentPattern } from '../../../../../../shared/constants/patterns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-window',
  imports: [TimeAgoPipe],
  templateUrl: './notifications-window.component.html',
  styleUrl: './notifications-window.component.scss',
})
export class NotificationsWindowComponent {
  notifications = input<any[]>();
  close = output();
  friendReqNotificationChoice = output<any>();

  private elementRef = inject(ElementRef);
  mainState = inject(MainStateService);
  router = inject(Router);

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);

    if (!clickedInside) {
      this.closeNotifications();
    }
  }

  closeNotifications(): void {
    console.log('Notifications component will be removed');
    this.close.emit();
  }

  acceptFriendReq(notificationId: string): void {
    const notification = {
      id: notificationId,
      chose: 'accept',
    };
    this.friendReqNotificationChoice.emit(notification);
  }

  removeNotification(notificationId: string): void {
    const notification = {
      id: notificationId,
      chose: 'remove',
    };

    this.friendReqNotificationChoice.emit(notification);
  }

  navigateToProfile(notificationContent: any): void {
    const username = notificationContent.match(getUsernameFromNotificationContentPattern)[1];
  
    this.router.navigate(['profile', username]);
  }
}
