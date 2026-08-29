import { inject, Injectable, Signal, signal } from '@angular/core';

import { Observable } from 'rxjs';

import io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { MainStateService } from '../../../pages/home/components/main/shared/services/main-state.service';
import { UtilitySessionService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class MainSocketService {
  private onlineUsers = signal<{ [key: string]: boolean }>({});
  private state = inject(MainStateService);
  private utilitySessionStorage = inject(UtilitySessionService);

  token = this.utilitySessionStorage.getToken();
  private socket = io(`${environment.api}?token=${this.token}`);

  sendStatus() {
    this.socket.emit('set-status');
  }

  listenForUserStatus() {
    this.socket.on(
      'user-status-update',
      (data: { username: string; isOnline: boolean }) => {
        console.log(data);

        this.state.friends.update((friends) =>
          friends.map((friend) => {
            if (friend.username === data.username) {
              return { ...friend, isOnline: data.isOnline };
            } else {
              return friend;
            }
          })
        );
      }
    );
  }

  onNewNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('new-notification', (notification: any) => {
        observer.next(notification);

        console.log('notifications', notification);
      });

      return () => this.socket.off('new-notification');
    });
  }

  sendMessage(receiver: string, text: string) {
    this.socket.emit('send-message', { receiver, text });
  }

  onNewMessage(): Observable<{
    sender: string;
    receiver: string;
    text: string;
  }> {
    return new Observable((observer) => {
      this.socket.on(
        'new-message',
        (message: { sender: string; receiver: string; text: string }) => {
          observer.next(message);
        }
      );

      return () => this.socket.off('new-message');
    });
  }

  getOnlineUsers(): Signal<{ [key: string]: boolean }> {
    return this.onlineUsers;
  }
}
