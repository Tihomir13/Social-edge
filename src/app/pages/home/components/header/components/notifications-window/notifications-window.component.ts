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

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);

    if (!clickedInside) {
      this.closeNotifications();
    }
  }

  ngOnInit() {}

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

  // OnDestroy за почистване на ресурси, ако е необходимо
  ngOnDestroy(): void {
    console.log('Notifications component destroyed');
  }
}
