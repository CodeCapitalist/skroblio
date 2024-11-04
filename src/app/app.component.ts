import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ControlsComponent } from './components/controls/controls.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ChatBoxMessageComponent } from './components/chat-box-message/chat-box-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CanvasComponent, ControlsComponent, ChatboxComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'skroblio';
}
