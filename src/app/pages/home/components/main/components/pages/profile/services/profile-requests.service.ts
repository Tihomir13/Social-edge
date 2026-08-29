import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../../shared/services/utility/utility.service';
import { environment } from '../../../../../../../../../environments/environment';

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
    return this.http.get(`${environment.api}/profiles/${username}`, this.headers);
  }

  getUserPosts(username: string, cursor: string | null, limit: number): Observable<any> {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    return this.http.get(`${environment.api}/profiles/${username}/posts`, {
      params,
      headers: this.utility.headers,
    });
  }

  getPosts(cursor: string | null, limit: number): Observable<any> {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    return this.http.get(`${environment.api}/posts`, {
      params,
      headers: this.utility.headers,
    });
  }

  getUserInfo(username: string): Observable<any> {
    return this.http.get(`${environment.api}/profiles/${username}/info`, this.headers);
  }

  addUserInfo(body: any): Observable<any> {
    return this.http.post(`${environment.api}/profiles/info`, body, this.headers);
  }

  addNewProfilePhoto(
    username: string | null,
    newProfilePhoto: any
  ): Observable<Object> {
    return this.http.post(
      `${environment.api}/profiles/${username}/new-profile-photo`,
      newProfilePhoto,
      {
        headers: this.utility.headers,
      }
    );
  }

  removeProfilePhoto(username: string | null): Observable<Object> {
    return this.http.delete(
      `${environment.api}/profiles/${username}/profile-photo-remove`,
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
      `${environment.api}/profiles/${username}/new-banner-photo`,
      newBannerPhoto,
      {
        headers: this.utility.headers,
      }
    );
  }

  removeBannerPhoto(username: string | null): Observable<Object> {
    return this.http.delete(`${environment.api}/profiles/${username}/banner-photo-remove`, {
      headers: this.utility.headers,
    });
  }

  addNewFriend(username: string | null): Observable<any> {
    return this.http.get(
      `${environment.api}/profiles/${username}/add-friend`,
      this.headers
    );
  }

  removeFriendRequestByUsername(username: string | null): Observable<any> {
    return this.http.delete(
      `${environment.api}/profiles/${username}/remove-friend-request`,
      this.headers
    );
  }

  removeFriend(username: string | null): Observable<any> {
    return this.http.delete(
      `${environment.api}/profiles/${username}/remove-friend`,
      this.headers
    );
  }

  acceptFriendRequestById(notificationId: string): Observable<any> {
    return this.http.post(
      `${environment.api}/profiles/friend-requests/accept`,
      {
        notificationId,
      },
      this.headers
    );
  }

  removeFriendRequestById(notificationId: string): Observable<any> {
    return this.http.post(
      `${environment.api}/profiles/friend-requests/reject`,
      {
        notificationId,
      },
      this.headers
    );
  }

  getProfileSettings(): Observable<any> {
    return this.http.get(`${environment.api}/profiles/profile-settings`, this.headers);
  }

  getProfileImage(): Observable<any> {
    return this.http.get(`${environment.api}/profiles/profile-image`, this.headers);
  }

  getSuggestedProfiles(): Observable<any> {
    return this.http.get(`${environment.api}/profiles/suggested-people`, this.headers);
  }

  getUserFriends(username: any): Observable<any> {
    return this.http.get(`${environment.api}/profiles/${username}/friends`, this.headers);
  }

  editProfileSettings(formData: any): Observable<any> {
    return this.http.patch(
      `${environment.api}/profiles/profile-settings`,
      formData,
      this.headers
    );
  }

  changePassword(newData: any): Observable<any> {
    return this.http.patch(`${environment.api}/profiles/change-password`, newData, {
      headers: this.utility.headers,
    });
  }

  sendDeletionEmail(): Observable<any> {
    return this.http.get(`${environment.api}/profiles/send-deletion-email`, this.headers);
  }
}
