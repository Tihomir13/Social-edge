import { inject, Injectable, Signal, signal } from '@angular/core';

import { api } from '../constants/api';
import io from 'socket.io-client';
import { MainStateService } from '../../pages/home/components/main/shared/services/main-state.service';

@Injectable({
  providedIn: 'root',
})
export class StatusSocketService {
  private socket = io(api);
  private onlineUsers = signal<{ [key: string]: boolean }>({});

  private state = inject(MainStateService);

  sendStatus(username: string) {
    this.socket.emit('set-status', { username });
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
