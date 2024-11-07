import { Coordinates } from "../models/coordinates";
import { FillConfiguration } from "../models/fill-options";

export class BucketFiller {
    context: CanvasRenderingContext2D | null = null;
    canvas!: HTMLCanvasElement
    bucketColor: Uint8ClampedArray;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null, bucketColorHex: string) {
        this.context = context;
        this.canvas = canvas;
        this.bucketColor = this.hexToRGB(bucketColorHex);
    }

    public setColor(bucketColor: Uint8ClampedArray) {
        this.bucketColor = bucketColor;
    }

    public floodFill(event: MouseEvent) {
        const isOverTopBorder = (pos: Coordinates): boolean => {
            return pos.y < 0;
        }
        const isOverBottomBorder = (pos: Coordinates): boolean => {
            return pos.y > this.canvas.height - 1;
        }
        const isOverLeftBorder = (pos: Coordinates): boolean => {
            return pos.x < 0;
        }
        const isOverRightBorder = (pos: Coordinates): boolean => {
            return pos.x > this.canvas.width - 1;
        }
        const isTargetColor = (pos: Coordinates, options: FillConfiguration): boolean => {
            return compareColors(getPixelColor(pos, options), options.targetColor);
        }
        const PositionUp = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x, pos.y - 1);
        }
        const PositionDown = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x, pos.y + 1);
        }
        const PositionLeft = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x - 1, pos.y);
        }
        const PositionRight = (pos: Coordinates): Coordinates => {
            return new Coordinates(pos.x + 1, pos.y);
        }
        const getPixelColor = (pos: Coordinates, options: FillConfiguration): Uint8ClampedArray => {
            var offset = getGridIndex(pos);
            return options.grid.slice(offset, offset + 4);
        }
        const getGridIndex = (pos: Coordinates): number => {
            return (pos.y * 4 * this.canvas.width) + (4 * pos.x)
        }
        const getPixelColorFromGrid = (pos: Coordinates, grid: Uint8ClampedArray): Uint8ClampedArray => {
            var offset = getGridIndex(pos);
            return grid.slice(offset, offset + 4);
        }
        const colorPixel = (pos: Coordinates, options: FillConfiguration): void => {
            this.context?.fillRect(pos.x, pos.y, 1, 1);
            let gridIndex = getGridIndex(pos);
            options.grid[gridIndex] = this.bucketColor[0];
            options.grid[gridIndex + 1] = this.bucketColor[0 + 1];
            options.grid[gridIndex + 2] = this.bucketColor[0 + 2];
            options.grid[gridIndex + 3] = this.bucketColor[0 + 3];
        }
        const compareColors = (color0: Uint8ClampedArray, color1: Uint8ClampedArray): boolean => {
            if (color0[0] !== color1[0]) return false;
            if (color0[1] !== color1[1]) return false;
            if (color0[2] !== color1[2]) return false;
            if (color0[3] !== color1[3]) return false;
            return true;
        }

        let pos = new Coordinates(event.offsetX, event.offsetY);
        if (isOverBottomBorder(pos) || isOverTopBorder(pos) || isOverLeftBorder(pos) || isOverRightBorder(pos)) {
            return;
        }
        if (this.context != null) {
            let grid = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
            let targetColor = getPixelColorFromGrid(pos, grid);
            let options = new FillConfiguration(grid, targetColor);

            let stack: Coordinates[] = [pos];
            while (stack.length >= 1) {
                pos = PositionUp(stack.pop()!);
                let checkLeft: boolean = true;
                let checkRight: boolean = true;
                while (!isOverTopBorder(pos) && isTargetColor(pos, options)) {
                    pos = PositionUp(pos);
                }
                pos = PositionDown(pos);
                while (!isOverBottomBorder(pos) && isTargetColor(pos, options)) {
                    colorPixel(pos, options);
                    let left = PositionLeft(pos);
                    let right = PositionRight(pos);
                    if (checkLeft) {
                        if (!isOverLeftBorder(left) && isTargetColor(left, options)) {
                            stack.push(left);
                            checkLeft = false;
                        }
                    }
                    else if (!isOverLeftBorder(left) && !isTargetColor(left, options)) {
                        checkLeft = true;
                    }
                    if (checkRight) {
                        if (!isOverRightBorder(right) && isTargetColor(right, options)) {
                            stack.push(right);
                            checkRight = false;
                        }
                    }
                    else if (!isOverRightBorder(right) && !isTargetColor(right, options)) {
                        checkRight = true;
                    }
                    pos = PositionDown(pos);
                }
            }
        }
    }

    private hexToRGB(hex: string): Uint8ClampedArray {
        return new Uint8ClampedArray([
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16),
            255]);
    }
}