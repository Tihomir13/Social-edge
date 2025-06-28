import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { api } from '../../../../../../../../../shared/constants/api';
import { UtilitySessionService } from '../../../../../../../../../shared/services/utility/utility.service';

@Injectable()
export class NewPostRequestsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  savePost(newPost: any): Observable<Object> {
    const formData = new FormData();

    formData.append('title', newPost.title);
    formData.append('text', newPost.text);

    if (newPost.status) {
      formData.append('statusName', newPost.status.name);
      formData.append('statusEmoji', newPost.status.emoji);
    }

    newPost.tags.forEach((tag: string) => {
      formData.append('tags', tag);
    });

    newPost.images.forEach((image: File) => {
      formData.append('images', image);
    });

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.post(`${api}/posts/create`, formData, {
      headers: this.utility.headers,
    });
  }
}
