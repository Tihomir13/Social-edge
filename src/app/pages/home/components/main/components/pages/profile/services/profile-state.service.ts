import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileStateService {
  isProfileOwner = signal<boolean>(false);

  setIsProfileOwner(bool: boolean) {
    this.isProfileOwner.set(bool);
  }
}
