import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilitySessionService {

  storage = sessionStorage; 

  get headers():
    | {
        Authorization: string;
      }
    | undefined {
    const token = this.storage.getItem('token');
    return token ? { Authorization: `${token}` } : undefined;
  }

  get userInfo() {
    const userInfo = this.storage.getItem('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo);
    } else {
      return null;
    }
  }

  setToken(newToken: string): void {
    this.storage.setItem('token', newToken);
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  setUserInfo(userInfo: object): void {
    this.storage.setItem('userInfo', JSON.stringify(userInfo));
  }

  resetSession(): void {
    this.storage.clear();
  }
}
