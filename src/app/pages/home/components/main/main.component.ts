import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FriendListComponent } from './components/friend-list/friend-list.component';
import { SuggestedProfilesComponent } from './components/suggested-profiles/suggested-profiles.component';
import { ChatHeadsComponent } from './components/chat-heads/chat-heads.component';
import { MainStateService } from './shared/services/main-state.service';
import { ChatComponent } from './components/chat/chat.component';
import { PostsStateService } from './components/feed/components/post/services/posts-state.service';
import { PostsRequestsService } from './components/feed/components/post/services/posts-requests.service';
import { NavigationComponent } from "./components/navigation/navigation.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FriendListComponent,
    SuggestedProfilesComponent,
    ChatHeadsComponent,
    ChatComponent,
    RouterOutlet,
    NavigationComponent
],
  providers: [PostsStateService, PostsRequestsService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  posts = signal<any[] | null>(null);

  state = inject(MainStateService);
  postsState = inject(PostsStateService);

  ngOnInit(): void {
    this.state.currentChatHeads = this.state.currentChatHeads;
  }

  onCloseChatHead(chatHeadIndex: number): void {
    this.state.currentChatHeads.set(
      this.state
        .currentChatHeads()
        .filter((_, index) => index !== chatHeadIndex)
    );
  }

  onProfileClick(chatHeadIndex: number): void {
    this.state.setChat(false);
  }

  onUserProfileClick(user: any): void {
    this.state.setChat(true);
  }
}
