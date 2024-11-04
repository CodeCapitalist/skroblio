export class ChatBoxMessage {
    message: string;
    type: string;
    date: Date;
    user!: string;

    constructor(message: string, type: string, date: Date, user?: string){
        this.message = message;
        this.type = type;
        this.date = date;
        if(user) {this.user = user;}
        console.log(this);
    }

}
