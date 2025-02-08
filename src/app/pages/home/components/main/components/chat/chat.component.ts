import { Component, inject } from '@angular/core';
import { MainStateService } from '../../shared/services/main-state.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  state = inject(MainStateService);

  closeChat():void {
    this.state.setChat(false);
  }
}
