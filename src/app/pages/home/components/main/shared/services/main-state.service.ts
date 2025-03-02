import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MainStateService {
  defaultProfileImg = 'assets/images/default-images/profile-image.png';

  posts = signal<any[]>([]);
  friends = signal<
    {
      username: string;
      isOnline: boolean;
      profileImage: { src: string; contentType: string };
    }[]
  >([]);
  currentChatHeads = signal<any[]>([]);
  isChatActive = signal<boolean>(false);
  searchedUsers = signal<any[]>([]);
  notifications = signal<any[]>([]);
  userProfileImg = signal<any>(this.defaultProfileImg);

  openedPost = signal<any>(undefined);

  setPosts(posts: any): void {
    this.posts.set(posts);
  }

  setFriends(friends: any): void {
    this.friends.set(friends);
  }

  setCurrChatHeads(chat: any): void {
    this.currentChatHeads.set(chat);
  }

  setChat(isChatOpened: boolean): void {
    this.isChatActive.set(isChatOpened);
  }

  setSearchedUsers(users: any): void {
    this.searchedUsers.set(users);
  }

  setProfileImage(image: any): void {
    this.userProfileImg.set(image);
  }

  setOpenedPost(postId: any): void {
    this.openedPost.set(this.posts().find((post) => post._id === postId));
    console.log(this.openedPost());
  }
}
