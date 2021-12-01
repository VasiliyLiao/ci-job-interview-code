import PubSub from '../PubSub';
import Product from '../productType/product';
import UserRepository from '../repositories/user';

class WebShopService {
    userRepository: UserRepository;
    pubSub: PubSub;

    constructor(userRepository: UserRepository, pubSub: PubSub) {
        this.userRepository = userRepository;
        this.pubSub = pubSub;
    }

    // The Webshop Class must provide a method to buy a product using buyProduct(userId, productType, productId);
    buyProduct(userId: number, productType: Product, productId: string ) {
        // verify user
        this.userRepository.findOne(userId);

        productType.onBuy(userId);

        // When the user has bought a product there needs to be an event published on the EventBus;
        this.pubSub.publish('bought_product', {
            userId,
            productType: productType.productType,
            productId
        });
    }
}

export default WebShopService;