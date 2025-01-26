import { Injectable, signal } from '@angular/core';
import { PostModel } from '../../components/feed/components/post/model/post.model';

@Injectable({
  providedIn: 'root',
})
export class MainStateService {
  posts = signal<any[]>([]);
  friends = signal<any[]>(['aaa']);
  currentChatHeads = signal<any[]>([]);
  isChatActive = signal<boolean>(false);
  searchedUsers = signal<any[]>([]);

  setPosts(posts: any):void {
    this.posts.set(posts);
  }
  
  setFriends(friends: any):void {
    this.friends.set(friends);
  }

  setCurrChatHeads(chat: any):void {
    this.currentChatHeads.set(chat);
  }

  setChat(isChatOpened: boolean):void {
    this.isChatActive.set(isChatOpened);
  }

  setSearchedUsers(users: any):void {
    this.searchedUsers.set(users);
  }
}
