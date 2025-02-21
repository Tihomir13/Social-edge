import { Component, inject, input, OnInit } from '@angular/core';
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

  mainState = inject(MainStateService);
  mainSocketService = inject(MainSocketService);
  msgRequestService = inject(MessagesRequestService);
  router = inject(Router);

  subscriptions = new Subscription();

  messages: messageModel[] = [];

  ngOnInit(): void {
    this.mainSocketService.onNewMessage().subscribe((message) => {
      console.log('Получено съобщение:', message);
      this.messages.push(message);
    });

    this.subscriptions.add(
      this.msgRequestService.getMessages(this.currChatUser()).subscribe({
        next: (response) => {
          console.log(response);
          this.messages = response.messages;
          console.log(this.messages);
          
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  navigateToProfile(): void {
    this.router.navigate(['profile', this.currChatUser().username]);
  }

  closeChat(): void {
    this.mainState.setChat(false);
  }

  sendMessage(message: string | void): void {
    this.mainSocketService.sendMessage(this.currChatUser().username, message!);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
