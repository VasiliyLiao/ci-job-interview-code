class User {
    id: number;
    username: string;
    hasSubscription: boolean;
    
    constructor(id: number, username: string, hasSubscription: boolean) {
        this.id = id;
        this.username = username;
        this.hasSubscription = hasSubscription;
    }

}

export default User;