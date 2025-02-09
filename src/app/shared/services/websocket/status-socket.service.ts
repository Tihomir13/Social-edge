import { inject, Injectable, Signal, signal } from '@angular/core';

import { api } from '../../constants/api';
import io from 'socket.io-client';
import { MainStateService } from '../../../pages/home/components/main/shared/services/main-state.service';

@Injectable({
  providedIn: 'root',
})
export class StatusSocketService {
  token = sessionStorage.getItem('token');
  private socket = io(`${api}?token=${this.token}`);

  private onlineUsers = signal<{ [key: string]: boolean }>({});
  private state = inject(MainStateService);

  sendStatus() {
    this.socket.emit('set-status');
  }

  listenForUserStatus() {
    this.socket.on(
      'user-status-update',
      (data: { username: string; isOnline: boolean }) => {
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

  getOnlineUsers(): Signal<{ [key: string]: boolean }> {
    return this.onlineUsers;
  }
}
