import Product from './product';
import UserRepository from '../repositories/user';

class Subscription extends Product {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }

    public get productType(): string {
        return 'Subscriptions';
    }

    onBuy(userId: number) {
        this.userRepository.activeUserSubscription(userId)
    }
}

export default Subscription;