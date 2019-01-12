export class User {

    constructor() {
    }

    copyUser(user: User): void {
        if(user) {
            this.id = user.id;
            this.name = user.name;
            this.roomId = user.roomId;
        }
    }

    id?: number;
    name?: string;
    roomId?: number;
}
