import { ElementRef, Injectable, Renderer2, RendererFactory2, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  TOOL_BRUSH: string = "brush";
  TOOL_FLOODFILL = "floodfill"
  
  //canvas event unlisteners
  unlistener_brushMouseDown!: () => void;
  unlistener_brushMouseUp!: () => void;
  unlistener_brushMouseOut!: () => void;
  unlistener_brushMouseEnter!: () => void;
  unlistener_brushMouseMove!: () => void;
  unlistener_floodFillClick!: () => void;

  //Drawing State
  latestX: number = 0;
  latestY: number = 0;
  private drawing: boolean = false;

  // Brush colour and size
  colour: string = "#3d34a5";
  strokeWidth: number = 25;
  public tool: string = this.TOOL_BRUSH;
  
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
  public renderer: Renderer2;
  public context: CanvasRenderingContext2D | null = null;
  public canvas!: HTMLCanvasElement
  public brushSize: Signal<number> = signal(5);
  
  constructor(private rendererFactory: RendererFactory2 ) {
    this.renderer = rendererFactory.createRenderer(null,null);
  }


  public SetCanvasContext(canvasElement: ElementRef<HTMLCanvasElement>){
    this.context = canvasElement.nativeElement.getContext('2d');  
    this.canvas = canvasElement.nativeElement;
    this.useBrush();
  }

  public GetCanvasContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  public ClearCanvas(){
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //Brush methods
  public setBrushColor(color: string){}
  
  public setBrushSize(size: number){}
  
  public useBrush(){
    this.tool = this.TOOL_BRUSH;
    this.unlistener_brushMouseDown = this.renderer.listen(
      this.canvas, 'mousedown', (event: MouseEvent) => this.mouseDown(event));
    this.unlistener_brushMouseUp = this.renderer.listen(
      this.canvas, 'mouseup', (event: MouseEvent) => this.endStroke(event));
    this.unlistener_brushMouseOut = this.renderer.listen(
      this.canvas, 'mouseout', (event: MouseEvent) => this.endStroke(event));
    this.unlistener_brushMouseEnter = this.renderer.listen(
      this.canvas, 'mouseenter', (event: MouseEvent) => this.mouseEnter(event));
  }

  public mouseDown(event: MouseEvent){
    if(this.drawing){
      return;
    }
    let element = this.canvas;
    this.unlistener_brushMouseMove = this.renderer.listen(element, 'mousemove', (event: MouseEvent) => this.mouseMove(event));
    this.startStroke(event.offsetX, event.offsetY)
  }

  public endStroke(event: MouseEvent){
    if(!this.drawing){
      return
    }
    this.drawing = false;
    this.unlistener_brushMouseMove();
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

  //Floodfill methods
  public useFloodFill(){
    this.tool = this.TOOL_FLOODFILL;
  }
  
  public floodFill(event: MouseEvent){
    this.unlistener_floodFillClick = this.renderer.listen(
      this.canvas, 'click', (event: MouseEvent) => this.floodFill(event));
      if(this.context != null){
        let grid = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let targetColor = this.context?.getImageData(event.offsetX, event.offsetY, 1, 1).data.slice(0,4); 
        this.context.fillStyle = this.colour;
        this.floodFillRecursive(grid, event.offsetX, event.offsetY, targetColor)
      }
      
  }
  public floodFillRecursive(grid: ImageData, x: number, y: number, targetColor: Uint8ClampedArray){
    
  }
  public colorPixel(position: number[], color: string){
    this.context?.fillRect(position[0], position[1], 1,1)
  }
}
