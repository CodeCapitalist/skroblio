import { ElementRef, Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  public brushColors = {
    "WHITE":    "#FFFFFF",
    "SILVER":   "#C0C0C0",
    "GRAY":     "#808080",
    "BLACK":    "#000000",
    "RED":      "#FF0000",
    "MAROON":   "#800000",
    "YELLOW":   "#FFFF00",
    "OLIVE":    "#808000",
    "LIME":     "#00FF00",
    "GREEN":    "#008000",
    "AQUA":     "#00FFFF",
    "TEAL":     "#008080",
    "BLUE":     "#0000FF",
    "NAVY":     "#000080",
    "FUCHSIA":  "#FF00FF",
    "PURPLE":   "#800080"
  }

  public brushSizes = [
    5,
    10,
    15,
    20,
    25
  ]

  public context: CanvasRenderingContext2D | null = null;
  public canvas!: HTMLCanvasElement
  public brushSize: Signal<number> = signal(5);
  constructor() { }


  public SetCanvasContext(canvasElement: ElementRef<HTMLCanvasElement>){
    this.context = canvasElement.nativeElement.getContext('2d');  
    this.canvas = canvasElement.nativeElement;
  }

  public GetCanvasContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  public ClearCanvas(){
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public setBrushColor(color: string){}
  public setBrushSize(size: number){}
}
