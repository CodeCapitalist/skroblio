import { Coordinates } from "../models/coordinates";
import { FillConfiguration } from "../models/fill-options";

export class Brush {
    context: CanvasRenderingContext2D | null = null;
    canvas!: HTMLCanvasElement
    brushColor: Uint8ClampedArray;
    size: number = 1;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null, bucketColorHex: string) {
        this.context = context;
        this.canvas = canvas;
        this.brushColor = this.hexToRGB(bucketColorHex);
    }

    public setSize(size: number){
        this.size = size;
    }

    public setColor(bucketColor: Uint8ClampedArray) {
        this.brushColor = bucketColor;
    }

    public isOverTopBorder(pos: Coordinates): boolean {
        return pos.y < 0;
    }
    public isOverBottomBorder(pos: Coordinates): boolean {
        return pos.y > this.canvas.height - 1;
    }
    public isOverLeftBorder(pos: Coordinates): boolean {
        return pos.x < 0;
    }
    public isOverRightBorder(pos: Coordinates): boolean {
        return pos.x > this.canvas.width - 1;
    }
    public PositionUp(pos: Coordinates, d: number): Coordinates {
        return new Coordinates(pos.x, pos.y - d);
    }
    public PositionDown(pos: Coordinates, d: number): Coordinates {
        return new Coordinates(pos.x, pos.y + d);
    }
    public PositionLeft(pos: Coordinates, d: number): Coordinates {
        return new Coordinates(pos.x - d, pos.y);
    }
    public PositionRight(pos: Coordinates, d: number): Coordinates {
        return new Coordinates(pos.x + d, pos.y);
    }

    public Stroke(pos: Coordinates){
        switch(this.size){
            case 1:
                this.Circle1(pos);
                break;
            case 3:
                this.Circle3(pos);
                break;
            case 5:
                this.Circle5(pos);
                break;
            default:
                break;
        }
    }

    public Circle1(pos:Coordinates){
        this.context?.fillRect(pos.x, pos.y, 1, 1);
    }
    public Circle3(pos:Coordinates){
        this.context?.fillRect(pos.x-1, pos.y-1, 3, 3);
    }
    public Circle5(pos:Coordinates){
        let p1 = this.PositionUp(this.PositionLeft(pos, 1), 2);
        let p2 = this.PositionLeft(this.PositionUp(pos, 1), 2);
        this.context?.fillRect(p1.x, p1.y, 3, 5);
        this.context?.fillRect(p2.x, p2.y, 3, 5);
    }

    private hexToRGB(hex: string): Uint8ClampedArray {
        return new Uint8ClampedArray([
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16),
            255]);
    }
}