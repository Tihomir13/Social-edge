import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilitySessionService } from '../../../../../../../../../shared/services/utility/utility.service';
import { api } from '../../../../../../../../../shared/constants/api';

@Injectable({
  providedIn: 'root',
})
export class PostsRequestsService {
  http = inject(HttpClient);
  utility = inject(UtilitySessionService);

  headers = {
    headers: this.utility.headers,
  };

  getPosts(): Observable<any> {
    return this.http.get(`${api}/posts`, this.headers);
  }

  getPostById(postId: string): Observable<any> {
    return this.http.get(`${api}/posts/${postId}`, this.headers);
  }
  
  likePost(postId: string): Observable<any> {
    const body = {
      id: postId,
    };

    return this.http.patch(`${api}/posts/like`, body, this.headers);
  }

  likeComment(postId: string, commentId: string): Observable<any> {
    const body = {
      postId,
      commentId,
    };

    return this.http.patch(`${api}/comments/like`, body, this.headers);
  }

  commentPost(comment: string, postId: string): Observable<any> {
    const body = {
      postId,
      comment,
    };

    return this.http.patch(`${api}/comments/add`, body, this.headers);
  }

  showMoreComments(
    postId: string,
    page: number,
    limit: number = 10
  ): Observable<any> {
    return this.http.get(`${api}/comments/get`, {
      params: { postId, page: page.toString(), limit: limit.toString() },
      headers: this.utility.headers,
    });
  }

  editPost(postId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${api}/posts/edit/${postId}`, formData, {
      headers: this.utility.headers,
    });
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${api}/posts/delete${postId}`, {
      headers: this.utility.headers,
    });
  }
}
