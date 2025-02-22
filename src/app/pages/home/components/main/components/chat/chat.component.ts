import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
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
  @ViewChild('chat') chat!: ElementRef;

  mainState = inject(MainStateService);
  mainSocketService = inject(MainSocketService);
  msgRequestService = inject(MessagesRequestService);
  render = inject(Renderer2);
  router = inject(Router);

  subscriptions = new Subscription();

  messages: messageModel[] = [];

  ngOnInit(): void {
    this.mainSocketService.onNewMessage().subscribe((message) => {
      console.log('Получено съобщение:', message);
      this.messages.unshift(message);
    });

    this.getMessages();
  }

  navigateToProfile(): void {
    this.router.navigate(['profile', this.currChatUser().username]);
  }

  onScroll(event: any): void {
    const container = this.chat.nativeElement;

    if (container.scrollTop === 0) {
      this.getMessages();
    }
  }

  closeChat(): void {
    this.mainState.setChat(false);
  }

  sendMessage(message: string | void): void {
    console.log(this.currChatUser());

    this.mainSocketService.sendMessage(this.currChatUser().username, message!);
  }

  getMessages(): void {
    this.subscriptions.add(
      this.msgRequestService.getMessages(this.currChatUser()).subscribe({
        next: (response) => {
          this.messages = response.messages;
          console.log(this.messages);
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
