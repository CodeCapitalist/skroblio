export class FillConfiguration {
    public grid: ImageData;
    public targetColor: Uint8ClampedArray;

    constructor(grid: ImageData, targetColor: Uint8ClampedArray){
        this.grid = grid;
        this.targetColor = targetColor;
    }
}