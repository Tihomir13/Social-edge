import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
} from '@angular/core';
import { TimeAgoPipe } from '../../../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-notifications-window',
  imports: [TimeAgoPipe],
  templateUrl: './notifications-window.component.html',
  styleUrl: './notifications-window.component.scss',
})
export class NotificationsWindowComponent {
  constructor(private elementRef: ElementRef) {}

  notifications = input<any[]>();
  close = output();
  friendReqNotificationChoice = output<any>();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    // console.log(
    //   clickedInside,
    //   targetElement.closest('.notifications-container')
    // );

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

  removeFriendReq(notificationId: string): void {
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
