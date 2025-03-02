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
import { messageModel } from './interfaces';
import { Subscription } from 'rxjs';
import { MessagesRequestService } from './services/messages-request.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [InputFieldComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  currChatUser = input<any>();
  minimizeChat = output();

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
    this.mainSocketService.onNewMessage().subscribe((message) => {
      console.log('Получено съобщение:', message);
      this.messages.update(messages => [message, ...messages]);
    });
  }

  ngOnChanges(): void {
    this.getMessages();
  }

  navigateToProfile(): void {
    this.router.navigate(['profile', this.currChatUser().username]);
  }

  onScroll(): void {
    const container = this.chat.nativeElement;

    const isAtTop =
    container.scrollHeight ===
    Math.round(container.scrollTop * -1) + container.clientHeight;
    // console.log(
    //   container.scrollHeight,
    //   container.scrollTop,
    //   container.clientHeight
    // );
    // console.log('At top:', isAtTop);

    if (isAtTop && this.nextCursor) {
      this.msgRequestService
        .getMessages(this.currChatUser(), this.nextCursor, 20)
        .subscribe({
          next: (response) => {
            this.messages.update(messages => [...messages, ...response.messages] )
            this.nextCursor = response.nextCursor;
            
          },
          error: (error) => {
            console.error('Error fetching messages:', error);
          },
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
  }

  sendMessage(message: string | void): void {
    console.log(this.currChatUser());

    this.mainSocketService.sendMessage(this.currChatUser().username, message!);
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
