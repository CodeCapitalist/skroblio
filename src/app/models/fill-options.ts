export class FillConfiguration {
    public grid: Uint8ClampedArray;
    public targetColor: Uint8ClampedArray;

    constructor(grid: Uint8ClampedArray, targetColor: Uint8ClampedArray){
        this.grid = grid;
        this.targetColor = targetColor;
    }
}