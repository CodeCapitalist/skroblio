import { Coordinates } from "../models/coordinates";
import { FillConfiguration } from "../models/fill-options";

export class BucketFiller   {
    context: CanvasRenderingContext2D | null = null;
    canvas!: HTMLCanvasElement
    bucketColor: Uint8ClampedArray;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null, bucketColor: Uint8ClampedArray){
        this.context = context;
        this.canvas = canvas;
        this.bucketColor = bucketColor;
    }

    public setColor(bucketColor: Uint8ClampedArray){
        this.bucketColor = bucketColor;
    }

    public floodFill(event: MouseEvent){
        const isOverTopBorder = (pos: Coordinates, options: FillConfiguration): boolean => {
            return pos.y < 0;
        }
        const isOverBottomBorder = (pos: Coordinates, options: FillConfiguration): boolean => {
            return pos.y > this.canvas.height - 1;
        }
        const isOverLeftBorder = (pos: Coordinates, options: FillConfiguration): boolean => {
            return pos.x < 0;
        }
        const isOverRightBorder = (pos: Coordinates, options: FillConfiguration): boolean => {
            return pos.x > this.canvas.width - 1;
        }
        const isTargetColor = (pos: Coordinates, options: FillConfiguration): boolean => {
            return this.compareColors(getPixelColor(pos,options), options.targetColor);
        }
        const PositionUp = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x, pos.y-1);
        }
        const PositionDown = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x, pos.y+1);
        }
        const PositionLeft = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x, pos.y-1);
        }
        const PositionRight = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x, pos.y+1);
        }
        const getPixelColor = (pos: Coordinates, options: FillConfiguration): Uint8ClampedArray => {
            var offset = (pos.y * 4 * pos.x) + (4 * pos.x);
            return options.grid.data.slice(offset, offset + 4);
        }
        const getPixelColorFromGrid = (pos: Coordinates, grid: ImageData): Uint8ClampedArray => {
            var offset = (pos.y * 4 * pos.x) + (4 * pos.x);
            return grid.data.slice(offset, offset + 4);
        }
        const colorPixel = (pos: Coordinates): void => {
            this.context?.fillRect(pos.x, pos.y, 1, 1);
        }

        let pos = new Coordinates(event.offsetX, event.offsetY);
        let x = event.offsetX;
        let y = event.offsetY;
        if(this.context != null){ 
            let grid = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            let targetColor = getPixelColorFromGrid(pos, grid);
            let options = new FillConfiguration(grid, targetColor);
            this.context.fillStyle = this.rgbaToHex(this.bucketColor);

            let stack: Coordinates[] = [pos];
            while(stack.length >= 1){
                pos = PositionUp(stack.pop()!);
                let checkLeft: boolean = true;
                let checkRight: boolean = true;
                while(!isOverTopBorder(pos, options) && isTargetColor(pos, options)){
                    pos = PositionUp(pos);
                }
                pos = PositionDown(pos);
                while(!isOverBottomBorder(pos, options) && isTargetColor(pos, options)){
                    colorPixel(pos);
                    let left = PositionLeft(pos);
                    let right = PositionRight(pos);
                    if(checkLeft){
                        if(!isOverLeftBorder(left, options) && isTargetColor(left, options)){
                            stack.push(left);
                        }
                        checkLeft = false;
                    }
                    else if(!isOverLeftBorder(left, options) && !isTargetColor(left, options)){
                        checkLeft = true;
                    }
                    if(checkRight){
                        if(!isOverRightBorder(right, options) && isTargetColor(right, options)){
                            stack.push(right);
                        }       
                        checkRight = false;
                    }
                    else if(!isOverRightBorder(right, options) && !isTargetColor(right, options)){
                        checkRight = true;
                    }
                } 
            }
        }
    }


    private compareColors(color0: Uint8ClampedArray, color1: Uint8ClampedArray){
    if(color0[0] !== color1[0]) return false;
    if(color0[1] !== color1[1]) return false;
    if(color0[2] !== color1[2]) return false;
    if(color0[3] !== color1[3]) return false;
    return true;
    }

    private rgbaToHex(rgba: Uint8ClampedArray): string {
        const componentToHex = (c: number): string => {
            const hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }; 
        const alphaToHex = (a: number): string => {
            const hex = Math.round(a * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };  
        return `#${componentToHex(rgba[0])}${componentToHex(rgba[1])}${componentToHex(rgba[2])}${alphaToHex(rgba[3])}`;
    }
}