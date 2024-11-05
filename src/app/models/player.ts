export class Player {
    name: string;
    score: number;
    rank!: number;

    constructor(name: string){
        this.name = name;
        this.score = 0;
    }

    public addPoints(points: number){
        this.score += points;
    }

    public resetScore(){
        this.score = 0;
    }

    public setRank(rank: number){
        this.rank = rank;
    }
}
