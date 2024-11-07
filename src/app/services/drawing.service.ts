import { ElementRef, Injectable, Renderer2, RendererFactory2, signal, Signal } from '@angular/core';
import { BucketFiller } from '../helpers/bucket-filler';
import { Brush } from '../helpers/brush';
import { Coordinates } from '../models/coordinates';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  TOOL_BRUSH: string = "brush";
  TOOL_FLOODFILL: string = "floodfill"
  
  //canvas event unlisteners
  unlistener_brushMouseDown: (() => void) | null = null;
  unlistener_brushMouseUp: (() => void) | null = null;
  unlistener_brushMouseOut: (() => void) | null = null;
  unlistener_brushMouseEnter: (() => void) | null = null;
  unlistener_brushMouseMove: (() => void) | null = null;
  unlistener_brushMouseClick: (() => void) | null = null;
  unlistener_floodFillClick: (() => void) | null = null;

  //Drawing State
  latestX: number = 0;
  latestY: number = 0;
  private drawing: boolean = false;

  // Brush colour and size
  colour: string = "#3d34a5";
  strokeWidth: number = 3;
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
  public brush!: Brush;
  
  constructor(private rendererFactory: RendererFactory2 ) {
    this.renderer = rendererFactory.createRenderer(null,null);
  }


  public SetCanvasContext(canvasElement: ElementRef<HTMLCanvasElement>){
    this.context = canvasElement.nativeElement.getContext('2d')!; 
    this.context.imageSmoothingEnabled = false; 
    this.canvas = canvasElement.nativeElement;
    this.brush = new Brush(this.canvas, this.context, this.colour)
    this.useBrush();
  }

  public GetCanvasContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  public ClearCanvas(){
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public printCanvas(){
    const getGridIndex = (x: number, y: number): number => {
      return (y * 4 * this.canvas.width) + (4 * x)
    }
    const getPixelColorFromGrid = (x: number, y: number, grid: Uint8ClampedArray): Uint8ClampedArray => {
        var offset = getGridIndex(x,y);
        return grid.slice(offset, offset + 4);
    }
    var grid = this.context?.getImageData(0,0,this.canvas.width,this.canvas.height).data!;
    var map: string = "";
    for(let i = 0; i < this.canvas.height; i++){
      for(let j = 0; j < this.canvas.width; j++){
        let color = getPixelColorFromGrid(j,i, grid);
        map += `| [${color[0].toString().padStart(3,'0')},${color[1].toString().padStart(3,'0')},${color[2].toString().padStart(3,'0')},${color[3].toString().padStart(3,'0')}] `;
      }
      map += `|\n`;
    }
    console.log(map);
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
    if(!this.unlistener_brushMouseClick){
      this.unlistener_brushMouseClick = this.renderer.listen(this.canvas, 'click', (event: MouseEvent) => this.mouseClick(event));
    }
    if(!this.unlistener_brushMouseDown){
      this.unlistener_brushMouseDown = this.renderer.listen(this.canvas, 'mousedown', (event: MouseEvent) => this.mouseDown(event));
    }
    if(!this.unlistener_brushMouseUp){
      this.unlistener_brushMouseUp = this.renderer.listen(this.canvas, 'mouseup', (event: MouseEvent) => this.endStroke(event));
    }
    if(!this.unlistener_brushMouseOut){
      this.unlistener_brushMouseOut = this.renderer.listen(this.canvas, 'mouseout', (event: MouseEvent) => this.endStroke(event));
    }
    if(!this.unlistener_brushMouseEnter){
      this.unlistener_brushMouseEnter = this.renderer.listen(this.canvas, 'mouseenter', (event: MouseEvent) => this.mouseEnter(event));
    }
    console.log('enabled brush listeners');
  }

  public removeBrushEventListeners(){
    console.log('disabling brush listeners');
    if(this.unlistener_brushMouseDown) { 
      this.unlistener_brushMouseDown(); 
      this.unlistener_brushMouseDown = null;
    }
    if(this.unlistener_brushMouseUp) { 
      this.unlistener_brushMouseUp(); 
      this.unlistener_brushMouseUp = null;
    }
    if(this.unlistener_brushMouseOut) { 
      this.unlistener_brushMouseOut(); 
      this.unlistener_brushMouseOut = null;
    }
    if(this.unlistener_brushMouseEnter) { 
      this.unlistener_brushMouseEnter(); 
      this.unlistener_brushMouseEnter = null;
    }
    if(this.unlistener_brushMouseClick) { 
      this.unlistener_brushMouseClick(); 
      this.unlistener_brushMouseClick = null;
    }
    console.log('disabled brush listeners');
  }

  public mouseDown(event: MouseEvent){
    if(this.drawing){
      return;
    }
    let element = this.canvas;
    if(!this.unlistener_brushMouseMove) {
      this.unlistener_brushMouseMove = this.renderer.listen(element, 'mousemove', (event: MouseEvent) => this.mouseMove(event));
    }
    this.startStroke(event.offsetX, event.offsetY)
  }

  public endStroke(event: MouseEvent){
    if(!this.drawing){
      return
    }
    this.drawing = false;
    if(this.unlistener_brushMouseMove) { 
      this.unlistener_brushMouseMove();
      this.unlistener_brushMouseMove = null;
    }
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
      this.context.imageSmoothingEnabled = false;
      this.context.moveTo(offsetX, offsetY);
      this.context.strokeStyle = this.colour;
      this.context.lineWidth = this.strokeWidth;
      this.context.lineCap = "butt";
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();
    }
  }


  public continueStroke(offsetX: number, offsetY: number){
    if(this.context != null){
      let line = this.calculateLine(this.latestX, this.latestY, offsetX, offsetY);
      this.brush.setSize(this.strokeWidth);
      line.forEach(pos => {
        this.brush.Stroke(pos)
      })
      this.latestX = offsetX;
      this.latestY = offsetY;
    }
  }

  public calculateLine(x0: number, y0: number, x1: number, y1: number): Coordinates[]{
    let line: Coordinates[] = [];
    let dx = (x1 - x0);
    let dy = (y1 - y0);
    let steps = Math.max(Math.abs(dx), Math.abs(dy));
    let xi = dx / steps;
    let yi = dy / steps;
    for(let i = 0; i < steps; i++){
      line.push(new Coordinates(Math.round(x0 + i*xi), Math.round(y0 + i*yi)))
    }
    return line;
  }

  public strokePoint(offsetX: number, offsetY: number, size: number){

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
    if(!this.unlistener_floodFillClick){
      this.unlistener_floodFillClick = this.renderer.listen(this.canvas, 'click', (event: MouseEvent) => this.floodFill(event));
    }
    console.log('enabled floodfill listeners');
  }

  public removeFloodFillEventListeners(){
    console.log('disabling floodfill listeners');
    if(this.unlistener_floodFillClick) { 
      this.unlistener_floodFillClick(); 
      this.unlistener_floodFillClick = null;
    }
    console.log('disabled floodfill listeners');
  }
  
  public floodFill(event: MouseEvent){  
    if(this.context != null){
      let bucketFiller: BucketFiller = new BucketFiller(this.canvas, this.context, this.colour)
      bucketFiller.floodFill(event);
    }   
  }

  public colorPixel(x: number, y: number){
    this.context?.fillRect(x, y, 1, 1);
  }
}
