import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatBoxMessage } from '../../models/chat-box-message';
import { ChatBoxMessageComponent } from '../chat-box-message/chat-box-message.component';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [FormsModule, ChatBoxMessageComponent],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent {
  public messagePrompt: string = "";

  constructor(public chatService: ChatService){ 
  }

  public sendMessage(){
    this.chatService.addMessage(new ChatBoxMessage(this.messagePrompt, "userMessage", new Date(Date.now()), "Me"));
  }
}
