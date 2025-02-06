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

  sendStatus(username: string) {
    this.socket.emit('set-status', { username });
  }

  private listenForUserStatus() {
    this.socket.on('user-status-update', (data: { username: string; online: boolean }) => {
      console.log(data);
      this.onlineUsers.update((users) => ({
        ...users,
        [data.username]: data.online,
      }));
    });
  }

  getOnlineUsers(): Signal<{ [key: string]: boolean }> {
    console.log(this.onlineUsers);
    return this.onlineUsers;
  }
}
