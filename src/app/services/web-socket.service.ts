import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatBoxMessage } from '../models/chat-box-message';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  socket!: WebSocket
  constructor(private chatService: ChatService) {
    this.socket = new WebSocket("ws://localhost:80");
    this.socket.binaryType = 'arraybuffer';
    this.setupListeners();
  }

  private setupListeners(){
    // Connection opened
    this.socket.addEventListener("open", (event) => {
      this.socket.send("Hello Server!");
    });

    // Listen for messages
    this.socket.addEventListener("message", (event) => {
      this.chatService.addMessage(
        new ChatBoxMessage(`Message from server: ${event.data}`,
        "log",
        new Date(Date.now())));
    });
  }

  public sendMessage(message: string){
    this.socket.send(message);
  }
}
