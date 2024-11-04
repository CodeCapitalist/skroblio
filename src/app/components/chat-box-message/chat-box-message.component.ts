import { Component, Input } from '@angular/core';
import { ChatBoxMessage } from '../../models/chat-box-message';

@Component({
  selector: 'app-chat-box-message',
  standalone: true,
  imports: [],
  templateUrl: './chat-box-message.component.html',
  styleUrl: './chat-box-message.component.css'
})
export class ChatBoxMessageComponent {
  @Input() message!: ChatBoxMessage;
}
