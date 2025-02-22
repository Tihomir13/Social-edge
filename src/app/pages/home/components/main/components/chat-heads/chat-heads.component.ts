import { Component, inject, input, OnInit, output } from '@angular/core';
import { MainStateService } from '../../shared/services/main-state.service';

@Component({
  selector: 'app-chat-heads',
  standalone: true,
  imports: [],
  templateUrl: './chat-heads.component.html',
  styleUrl: './chat-heads.component.scss',
})
export class ChatHeadsComponent {
  mainState = inject(MainStateService);
  close = output<string>();
  open = output<string>();

  onProfileClick(username: string): void {
    this.open.emit(username);
  }

  onClose(username: string): void {
    this.close.emit(username);
  }
}
