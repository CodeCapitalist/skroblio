import { Component } from '@angular/core';
import { DrawingService } from '../../services/drawing.service';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css'
})
export class ControlsComponent {

  constructor(private drawingService: DrawingService, private webSocketService: WebSocketService){

  }

  public clearCanvas(){
    this.drawingService.ClearCanvas();
  }
  
  public setBrushSize(size: number){

  }

  public setBrushColor(color: string){
    
  }

  public useFloodFill(){
    this.drawingService.useFloodFill();
  }
  
  public useBrush(){
    this.drawingService.useBrush();
  }

  public printCanvas(){
    this.drawingService.printCanvas();
  }

  public sendMessage(){
    this.webSocketService.sendMessage("yurrrr");
  }
}
