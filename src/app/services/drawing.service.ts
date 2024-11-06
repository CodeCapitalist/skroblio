import { ElementRef, Injectable, Renderer2, RendererFactory2, signal, Signal } from '@angular/core';

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
      let grid = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      let targetColor = this.getPixelColor(grid, event.offsetX, event.offsetY);
      this.context.fillStyle = this.colour;
      this.floodFillRecursive(grid, event.offsetX, event.offsetY, targetColor)
    }   
  }
  public floodFillRecursive(grid: ImageData, x: number, y: number, targetColor: Uint8ClampedArray){
    var pixelStack = [[x,y]];
    while(pixelStack.length > 0){
      let position = pixelStack.pop()!;
      // console.log(`pop: ${position}`)
      let y = position[1];
      let x = position[0];
      let gridIndex = this.positionToGridIndex(position);
      while(y-- >= 0 && this.compareColors(this.getPixelColorAtGridIndex(grid, gridIndex), targetColor)){
        gridIndex = this.moveGridYPosition(gridIndex, -1);
      }
      gridIndex = this.moveGridYPosition(gridIndex, 1);
      ++y;
      let reachLeft = false;
      let reachRight = false;
      while(y++ < this.canvas.height - 1 && this.compareColors(this.getPixelColorAtGridIndex(grid,gridIndex), targetColor)){
        console.log(`color: [${x},${y}]`);
        this.colorPixel(x,y);
        //look left
        if(x > 0){
          if(this.compareColors(this.getPixelColorAtGridIndex(grid, this.moveGridXPosition(gridIndex, -1)), targetColor)){
            if(!reachLeft){
              // console.log(`push: [${x-1},${y}]`);
              pixelStack.push([x-1,y]);
              reachLeft = true;
            }
          }
          else if(reachLeft){
            reachLeft = false;
          }
        }
        //look right
        if(x < this.canvas.width - 1){
          if(this.compareColors(this.getPixelColorAtGridIndex(grid, this.moveGridXPosition(gridIndex, 1)), targetColor)){
            if(!reachRight){
              // console.log(`push: [${x+1},${y}]`);
              pixelStack.push([x+1,y]);
              reachRight = true;
            }
          }
          else if(reachRight){
            reachRight = false;
          }
        }
        gridIndex = this.moveGridYPosition(gridIndex, 1);
      }
    }
  }



  
  public colorPixel(x: number, y: number){
    this.context?.fillRect(x, y, 1, 1);
  }

  private getPixelColor(grid: ImageData, x: number, y: number): Uint8ClampedArray {
    var offset = (y * 4 * x) + (4 * x);
    return grid.data.slice(offset, offset + 4);
  }

  private getPixelColorAtGridIndex(grid: ImageData, gridIndex: number): Uint8ClampedArray {
    return grid.data.slice(gridIndex, gridIndex+4);
  }

  private positionToGridIndex(position: number[] | undefined){
    if(position){
      return (position[1] * 4 * this.canvas.width) + (4 * position[0]);
    }
    console.error('Invalid position!');
    return -1;
  }

  private moveGridXPosition(position: number, xScalar: number): number {
    return position + (xScalar*4);
  }

  private moveGridYPosition(position: number, yScalar: number): number {
    return position + (yScalar * this.canvas.width * 4);
  }

  private compareColors(color0: Uint8ClampedArray, color1: Uint8ClampedArray){
    if(color0[0] !== color1[0]) return false;
    if(color0[1] !== color1[1]) return false;
    if(color0[2] !== color1[2]) return false;
    if(color0[3] !== color1[3]) return false;
    return true;
  }

  private hexToRgba(hex: string, alpha: number = 1): Uint8ClampedArray {
    // Remove the # if it exists
    hex = hex.replace("#", "");
  
    // Check if it's a 3-digit hex color
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
  
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Return the rgba string
    return new Uint8ClampedArray([r,g,b,255]);
  }
}
