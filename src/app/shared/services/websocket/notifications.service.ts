import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import io from 'socket.io-client';
import { api } from '../../constants/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  token = sessionStorage.getItem('token');

  private socket = io(`${api}?token=${this.token}`);

  addNewFriend(username: string | null) {
    this.socket.emit('add-friend', username, (response: any) => {
      console.log('Server response:', response);
    });
  }

  // Изпраща заявка за нотификации на потребителя
  requestNotifications(username: string) {
    this.socket.emit('get-notifications', { username });
  }

  // Слуша за нови нотификации
  onNewNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('new-notification', (notification: any) => {
        observer.next(notification);

        console.log('notifications', notification);
      });

      return () => this.socket.off('new-notification');
    });
  }
}
