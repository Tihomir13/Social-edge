import { Component, inject, input } from '@angular/core';
import { MainStateService } from '../../shared/services/main-state.service';
import { InputFieldComponent } from "./components/input-field/input-field.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [InputFieldComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  mainState = inject(MainStateService);
  currChatUser = input<any>();

  closeChat():void {
    this.mainState.setChat(false);
  }
}
