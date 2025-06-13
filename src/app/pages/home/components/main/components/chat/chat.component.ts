import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { MainStateService } from '../../shared/services/main-state.service';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { MainSocketService } from '../../../../../../shared/services/websocket/main-socket.service';

import { Subscription } from 'rxjs';

import { MessagesRequestService } from './services/messages-request.service';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { TimeAgoPipe } from '../../../../../../shared/pipes/time-ago.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [InputFieldComponent, LoadingSpinnerComponent, DatePipe, TimeAgoPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  currChatUser = input<any>();
  minimizeChat = output<any>();

  isLoadingMessages: boolean = false;

  nextCursor: string | null = null;

  @ViewChild('chat') chat!: ElementRef;

  mainState = inject(MainStateService);
  mainSocketService = inject(MainSocketService);
  msgRequestService = inject(MessagesRequestService);
  render = inject(Renderer2);
  router = inject(Router);

  subscriptions = new Subscription();

  messages = signal<any>([])

  ngOnInit(): void {
    console.log(this.currChatUser());

    this.mainSocketService.onNewMessage().subscribe((message) => {
      console.log('Получено съобщение:', message);
      this.messages.update(messages => [message, ...messages]);
    });

    this.mainState.friends.update((friends) => friends.map(friend => {
      if (friend.username === this.currChatUser().username) {
        return { ...friend, hasNewMessage: false };
      }
      return friend;
    }))
  }

  ngOnChanges(): void {
    this.getMessages();
  }

  isOlderThanAWeek(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff > 7 * 24 * 60 * 60 * 1000;
  }

  navigateToProfile(): void {
    this.router.navigate(['profile', this.currChatUser()!.username]);
  }

  isOnTop(): boolean {
    const container = this.chat.nativeElement;

    return container.scrollHeight === container.scrollTop * -1 + container.clientHeight + 1;
  }

  onScroll(): void {
    console.log(this.isOnTop(), this.nextCursor, !this.isLoadingMessages);

    if (this.isOnTop() && this.nextCursor && !this.isLoadingMessages) {
      this.isLoadingMessages = true;
      this.msgRequestService
        .getMessages(this.currChatUser(), this.nextCursor, 20)
        .subscribe({
          next: (response) => {
            this.messages.update(messages => [...messages, ...response.messages])
            this.nextCursor = response.nextCursor;

          },
          error: (error) => {
            console.error('Error fetching messages:', error);
          },
          complete: () => {
            this.isLoadingMessages = false;
          }
        });

      console.log(this.messages());
    }
  }

  onMinimizeChat(): void {
    this.minimizeChat.emit(this.currChatUser());
    this.mainState.setChat(false);
  }

  onCloseChat(): void {
    this.mainState.setChat(false);

    this.mainState.currentChatHeads.update(chatHeads => {
      return chatHeads.filter(chatHead => chatHead.username !== this.currChatUser()!.username);
    });
  }

  sendMessage(message: string | void): void {
    console.log(this.currChatUser());

    this.mainSocketService.sendMessage(this.currChatUser()!.username, message!);
  }

  getMessages(): void {
    this.subscriptions.add(
      this.msgRequestService
        .getMessages(this.currChatUser(), this.nextCursor, 20)
        .subscribe({
          next: (response) => {
            this.messages.update(messages => messages = response.messages)
            this.nextCursor = response.nextCursor;
            console.log(response);
          },
          error: (error) => {
            console.log(error);
          },
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
