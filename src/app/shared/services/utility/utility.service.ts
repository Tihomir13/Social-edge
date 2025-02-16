import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilitySessionService {
  get headers():
    | {
        Authorization: string;
      }
    | undefined {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `${token}` } : undefined;
  }

  get userInfo() {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo);
    } else {
      return null;
    }
  }

  setToken(newToken: any) {
    sessionStorage.setItem('token', newToken);
  }

  resetSession(): void {
    sessionStorage.clear();
  }
}
