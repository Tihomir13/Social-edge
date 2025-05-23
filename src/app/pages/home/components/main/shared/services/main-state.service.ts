import { Injectable, signal } from '@angular/core';
import { ChatUserModel } from '../../components/chat/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MainStateService {
  defaultProfileImg = 'assets/images/default-images/profile-image.png';
  defaultBannerImg = 'assets/images/default-images/banner-image.png';

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
  currChatProfileUser = signal<null | ChatUserModel>(null);
  searchedUsers = signal<any[]>([]);
  notifications = signal<any[]>([]);
  userProfileImg = signal<any>(this.defaultProfileImg);

  isLoading = signal({
    posts: true,
    friends: true,
    notifications: true,
    profileImage: true,
  });

  openedPost = signal<any>(null);

  setPosts(posts: any): void {
    this.posts.set(posts);
  }

  updatePost(postId: string, updatedPost: any) {
    this.posts.update((currentPosts) =>
      currentPosts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
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

  setOpenedPreFetchPost(postId: any): void {
    if (postId) {
      this.openedPost.set(this.posts().find((post) => post._id === postId));
    }
  }

  setOpenedPost(post: any, isModal: boolean): void {
    const openedPost = {
      ...post,
      isModal,
    };

    this.openedPost.set(openedPost);
  }

  closePost(): void {
    this.openedPost.set(null);
  }

  addNewPostToFeed(newPost: any): void {
    this.posts.update((posts) => [newPost, ...posts]);
  }

  addNewCommentToPost(postId: any, newComment: any): void {
    this.posts.update((posts) =>
      posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [newComment, ...(post.comments || []) ],
            commentsCount: post.commentsCount + 1,
          };
        } else {
          return post;
        }
      })
    );

    if (this.openedPost()) {
      this.openedPost.update((post) => {
        return {
          ...post,
          comments: [newComment, ...(post.comments || [])],
        };
      });
    }
  }

  deletePost(postId: string): void {
    if (!postId) {
      return;
    }

    this.posts.update((posts) => posts.filter((post) => post._id != postId));
  }

  setLoadingState(key: keyof ReturnType<typeof this.isLoading>): void {
    this.isLoading.update((isLoading) => ({
      ...isLoading,
      [key]: false,
    }));
  }

  // updateCommentLikeState(postId: string, commentId: string) {
  //   // Променяме постовете и използваме set, за да зададем нова стойност на posts
  //   const updatedPosts = this.posts().map((post) => {
  //     if (post._id === postId) {
  //       return {
  //         ...post,
  //         comments: post.comments.map((comment: any) =>
  //           comment._id === commentId
  //             ? { ...comment, isLiked: !comment.isLiked }
  //             : comment
  //         ),
  //       };
  //     }
  //     return post;
  //   });

  //   // Задаваме новото състояние на feed-а с set
  //   this.posts.set(updatedPosts);

  //   // Проверяваме ако постът е отворен в modal-а
  //   const openedPost = this.openedPost();
  //   if (openedPost && openedPost._id === postId) {
  //     // Обновяваме коментара и в modal-а с set
  //     this.openedPost.set({
  //       ...openedPost,
  //       comments: openedPost.comments.map((comment: any) =>
  //         comment._id === commentId
  //           ? { ...comment, isLiked: !comment.isLiked }
  //           : comment
  //       ),
  //     });
  //   }
  // }
}
