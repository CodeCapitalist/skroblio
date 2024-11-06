import { ElementRef, Injectable, Renderer2, RendererFactory2, signal, Signal } from '@angular/core';
import { BucketFiller } from '../helpers/bucket-filler';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  TOOL_BRUSH: string = "brush";
  TOOL_FLOODFILL: string = "floodfill"
  
  //canvas event unlisteners
  unlistener_brushMouseDown!: () => void;
  unlistener_brushMouseUp!: () => void;
  unlistener_brushMouseOut!: () => void;
  unlistener_brushMouseEnter!: () => void;
  unlistener_brushMouseMove!: () => void;
  unlistener_brushMouseClick!: () => void;
  unlistener_floodFillClick!: () => void;

  //Drawing State
  latestX: number = 0;
  latestY: number = 0;
  private drawing: boolean = false;

  // Brush colour and size
  colour: string = "#3d34a5";
  strokeWidth: number = 1;
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
  public setBrushColor(color: string){

  }
  
  public setBrushSize(size: number){

  }
  
  public useBrush(){
    console.log('enabling brush');
    if(this.tool === this.TOOL_FLOODFILL){
      this.removeFloodFillEventListeners();
    }
    this.setBrushEventListeners();
    this.tool = this.TOOL_BRUSH;
    console.log('brush enabled');
  }

  private setBrushEventListeners(){
    console.log('enabling brush listeners');
    this.unlistener_brushMouseClick = this.renderer.listen(this.canvas, 'click', (event: MouseEvent) => this.mouseClick(event));
    this.unlistener_brushMouseDown = this.renderer.listen(this.canvas, 'mousedown', (event: MouseEvent) => this.mouseDown(event));
    this.unlistener_brushMouseUp = this.renderer.listen(this.canvas, 'mouseup', (event: MouseEvent) => this.endStroke(event));
    this.unlistener_brushMouseOut = this.renderer.listen(this.canvas, 'mouseout', (event: MouseEvent) => this.endStroke(event));
    this.unlistener_brushMouseEnter = this.renderer.listen(this.canvas, 'mouseenter', (event: MouseEvent) => this.mouseEnter(event));
    console.log('enabled brush listeners');
  }

  public removeBrushEventListeners(){
    console.log('disabling brush listeners');
    if(this.unlistener_brushMouseDown) { this.unlistener_brushMouseDown(); }
    if(this.unlistener_brushMouseUp) { this.unlistener_brushMouseUp(); }
    if(this.unlistener_brushMouseOut) { this.unlistener_brushMouseOut(); }
    if(this.unlistener_brushMouseEnter) { this.unlistener_brushMouseEnter(); }
    if(this.unlistener_brushMouseClick) { this.unlistener_brushMouseClick(); }
    console.log('disabled brush listeners');
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
    if(this.unlistener_brushMouseMove) { this.unlistener_brushMouseMove(); }
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

  public mouseClick(event: MouseEvent){
    this.pointStoke(event.offsetX, event.offsetY);
  }

  public pointStoke(offsetX: number, offsetY: number){
    if(this.context != null){
      this.context.beginPath();
      this.context.moveTo(offsetX, offsetY);
      this.context.strokeStyle = this.colour;
      this.context.lineWidth = this.strokeWidth;
      this.context.lineCap = "round";
      this.context.lineJoin = "round";
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();
    }
  }

  public continueStroke(offsetX: number, offsetY: number){
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
    console.log("enabling floodfill");
    this.removeBrushEventListeners();
    this.setFloodFillEventListeners();
    this.tool = this.TOOL_FLOODFILL;
    console.log('floodfill enabled');
  }

  public setFloodFillEventListeners() {
    console.log('enabling floodfill listeners');
    this.unlistener_floodFillClick = this.renderer.listen(this.canvas, 'click', (event: MouseEvent) => this.floodFill(event));
    console.log('enabled floodfill listeners');
  }

  public removeFloodFillEventListeners(){
    console.log('disabling floodfill listeners');
    if(this.unlistener_floodFillClick) { this.unlistener_floodFillClick(); }
    console.log('disabled floodfill listeners');
  }
  
  public floodFill(event: MouseEvent){  
    if(this.context != null){
      let bucketFiller: BucketFiller = new BucketFiller(this.canvas, this.context, this.colour)
    }   
  }




  public colorPixel(x: number, y: number){
    this.context?.fillRect(x, y, 1, 1);
  }

  private getPixelColor(grid: ImageData, x: number, y: number): Uint8ClampedArray {
    var offset = (y * 4 * x) + (4 * x);
    return grid.data.slice(offset, offset + 4);
  }

}
