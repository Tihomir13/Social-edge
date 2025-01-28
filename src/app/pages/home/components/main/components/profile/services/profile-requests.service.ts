import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../shared/services/utility/utility.service';
import { api } from '../../../../../../../shared/constants/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileRequestsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  headers = {
    headers: this.utility.headers,
  };

  getInitialUserData(username: string): Observable<any> {
    return this.http.get(`${api}/profiles/${username}`, this.headers);
  }

  getUserPosts(username: string): Observable<any> {
    return this.http.get(`${api}/profiles/${username}/posts`, this.headers);
  }

  getUserInfo(username: string): Observable<any> {
    return this.http.get(`${api}/profiles/${username}/info`, this.headers);
  }

  addUserInfo(username: string | null, body: any): Observable<any> {
    return this.http.post(
      `${api}/profiles/${username}/info`,
      body,
      this.headers
    );
  }

  addNewProfilePhoto(
    username: string | null,
    newProfilePhoto: any
  ): Observable<Object> {
    return this.http.post(
      `${api}/profiles/${username}/new-profile-photo`,
      newProfilePhoto,
      {
        headers: this.utility.headers,
      }
    );
  }

  removeProfilePhoto(username: string | null): Observable<Object> {
    return this.http.delete(
      `${api}/profiles/${username}/profile-photo-remove`,
      {
        headers: this.utility.headers,
      }
    );
  }

  addNewBannerPhoto(
    username: string | null,
    newBannerPhoto: any
  ): Observable<Object> {
    return this.http.post(
      `${api}/profiles/${username}/new-banner-photo`,
      newBannerPhoto,
      {
        headers: this.utility.headers,
      }
    );
  }

  removeBannerPhoto(username: string | null): Observable<Object> {
    return this.http.delete(`${api}/profiles/${username}/banner-photo-remove`, {
      headers: this.utility.headers,
    });
  }

  addNewFriend(username: string | null): Observable<any> {
    return this.http.get(
      `${api}/profiles/${username}/add-friend`,
      this.headers
    );
  }

  removeFriend(username: string | null): Observable<any> {
    return this.http.delete(
      `${api}/profiles/${username}/remove-friend`,
      this.headers
    );
  }

  acceptFriendRequest(notificationId: string): Observable<any> {
    return this.http.post(`${api}/profiles/friend-requests/accept`, {
      notificationId,
    }, this.headers);
  }

  removeFriendRequest(notificationId: string): Observable<any> {
    return this.http.post(`${api}/profiles/friend-requests/reject`, {
      notificationId,
    }, this.headers);
  }
}
