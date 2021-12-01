import User from '../entities/user';

class UserRepository {
    autoIncreamtIndex: number = 0;
    users: Map<number, User> = new Map;

    public findAll(): Array<User> {
        return Array.from(this.users.values());
    }

    public findOne(id: number): User {
        const user = this.users.get(id);
        if (!user) {
            throw new Error("not found user");
        }

        return user;
    }

    public create(username: string): User {
        const user = new User(this.autoIncreamtIndex, username, false);
        this.users.set(user.id, user);

        this.autoIncreamtIndex = this.autoIncreamtIndex + 1;
        return user;
    }

    public activeUserSubscription(userId: number) {
        const user = this.findOne(userId);
        user.hasSubscription = true;

        this.users.set(user.id, user);
    }

}

export default UserRepository;