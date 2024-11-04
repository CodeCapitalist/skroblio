import { Component, ElementRef, Renderer2, Signal, viewChild } from '@angular/core';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  //HTML Drawing Context
  canvasElement: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required<ElementRef<HTMLCanvasElement>>('myCanvas');
  context: CanvasRenderingContext2D | null = null;

  //Drawing State
  latestX: number = 0;
  latestY: number = 0;
  private drawing: boolean = false;
  unlistener!: () => void;

  // Brush colour and size
  colour: string = "#3d34a5";
  strokeWidth: number = 25;

  constructor(private drawingService: DrawingService, private renderer: Renderer2){
  }

  ngAfterViewInit() {
    this.drawingService.SetCanvasContext(this.canvasElement());
    this.context = this.drawingService.GetCanvasContext(); 
  }

  public mouseDown(event: MouseEvent){
    if(this.drawing){
      return;
    }
    let element = this.canvasElement().nativeElement;
    this.unlistener = this.renderer.listen(element, 'mousemove', (event: MouseEvent) => this.mouseMove(event));
    this.startStroke(event.offsetX, event.offsetY)
  }

  public endStroke(event: MouseEvent){
    if(!this.drawing){
      return
    }
    this.drawing = false;
    this.unlistener();
  }

  public mouseEnter(event: MouseEvent){
    console.log(event.button);
    if(!this.drawing){
      return;
    }
    this.mouseDown(event);
  }

  public mouseMove(event: MouseEvent){
    if(!this.drawing){
      return;
    }
    this.continueStroke(event.offsetX, event.offsetY)
  }

  public continueStroke(offsetX: number, offsetY: number){
    console.log(`${offsetX}:${offsetY}`);
    if(this.context != null){
      this.context.beginPath();
      this.context.moveTo(this.latestX, this.latestY);
      this.context.strokeStyle = this.colour;
      this.context.lineWidth = this.strokeWidth;
      this.context.lineCap = "round";
      this.context.lineJoin = "round";
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();

      this.latestX = offsetX;
      this.latestY = offsetY;
    }
  }

  public startStroke(offsetX: number, offsetY: number){
    this.drawing = true;
    this.latestX = offsetX;
    this.latestY = offsetY
  }
}
