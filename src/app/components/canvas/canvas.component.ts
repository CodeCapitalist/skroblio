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

  constructor(private drawingService: DrawingService){}

  ngAfterViewInit() {
    this.drawingService.SetCanvasContext(this.canvasElement());
  }
}
