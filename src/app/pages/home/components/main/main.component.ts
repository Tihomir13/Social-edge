import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FriendListComponent } from './components/friend-list/friend-list.component';
import { ChatHeadsComponent } from './components/chat-heads/chat-heads.component';
import { MainStateService } from './shared/services/main-state.service';
import { ChatComponent } from './components/chat/chat.component';
import { PostsRequestsService } from './components/feed/components/post/services/posts-requests.service';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FriendListComponent,
    // SuggestedProfilesComponent,
    ChatHeadsComponent,
    ChatComponent,
    RouterOutlet,
    NavigationComponent,
  ],
  providers: [PostsRequestsService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  state = inject(MainStateService);
  currProfileUserChat: any;

  constructor() {
    effect(() => {
      const newFriends = this.state.friends();

      if (!this.currProfileUserChat || !newFriends) {
        return;
      }

      this.currProfileUserChat = newFriends.find(
        (friend) => this.currProfileUserChat.username === friend.username
      );
    });
  }

  ngOnInit(): void {
    this.state.currentChatHeads = this.state.currentChatHeads;
  }

  onMinimizeChat(user: any): void {
    if (this.state.currentChatHeads().includes(user)) {
      return;
    }

    this.state.currentChatHeads.update((chatHeads) => [...chatHeads, user]);
  }

  onCloseChatHead(username: string): void {
    this.state.currentChatHeads.update((chatHeads) =>
      chatHeads.filter((chatHead) => chatHead.username != username)
    );
  }

  onProfileClick(username: string): void {
    this.currProfileUserChat = this.state
      .currentChatHeads()
      .find((chatHead) => chatHead.username === username);

    this.state.setChat(true);
  }

  onUserProfileClick(user: any): void {
    this.currProfileUserChat = user;
  }
}
