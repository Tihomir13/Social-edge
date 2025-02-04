import { Injectable, Signal, signal } from '@angular/core';

import { api } from '../constants/api';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StatusSocketService {
  private socket = io(api);
  private onlineUsers = signal<{ [key: string]: boolean }>({});

  constructor() {
    this.listenForUserStatus();
  }

  sendStatus(userId: string) {
    this.socket.emit('set-status', { userId });
  }

  private listenForUserStatus() {
    this.socket.on('user-status-update', (data: { userId: string; online: boolean }) => {
      console.log(data);
      
      this.onlineUsers.update((users) => ({
        ...users,
        [data.userId]: data.online,
      }));
    });
  }

  getOnlineUsers(): Signal<{ [key: string]: boolean }> {
    console.log(this.onlineUsers);
    return this.onlineUsers;
  }
}
