import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ChatBoxMessage } from '../models/chat-box-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: WritableSignal<ChatBoxMessage[]> = signal([]);
  constructor() { }

  public addMessage(message: ChatBoxMessage){
    this.messages.update(messages => [message, ...messages]);
  }
}
