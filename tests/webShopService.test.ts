import User from '../src/entities/user';
import UserRepository from '../src/repositories/user';
import PubSub from '../src/PubSub';
import WebShopService from '../src/services/webshop';
import TokenService from '../src/services/token';
import Token from '../src/productType/token';
import Subscription from '../src/productType/subscription';

// Task3
describe('Test WebShopService', () => {
    let userRepository: UserRepository;
    let testUser1: User;
    let pubSub: PubSub;

    let webShopService: WebShopService;

    beforeEach(()=>{
        userRepository = new UserRepository();
        testUser1 = userRepository.create('test1');

        pubSub = new PubSub();

        webShopService = new WebShopService(userRepository, pubSub);
    })

    test('buy Tokens', () => {
        const tokenService = new TokenService(userRepository, pubSub);
        tokenService.balances.set(testUser1.id, 500);
        const token = new Token(tokenService, 100);
        let recevicePayload = null;
        pubSub.subscribe('bought_product', (payload) => {
            recevicePayload = payload;
        });
        webShopService.buyProduct(testUser1.id, token, token.productId);
        const balance = tokenService.getUserBalance(testUser1.id);

        // balance bill
        expect(balance).toBe(600);
        // pubsub recevice
        expect(recevicePayload).toStrictEqual({
            userId: testUser1.id,
            productType: token.productType,
            productId: token.productId
        });
    });

    test('buy Subscriptions', () => {
        expect(testUser1.hasSubscription).toBe(false);

        const subscription = new Subscription(userRepository);
        let recevicePayload = null;
        pubSub.subscribe('bought_product', (payload) => {
            recevicePayload = payload;
        });
        webShopService.buyProduct(testUser1.id, subscription, subscription.productId);
        // user hasSubscriptions
        const user = userRepository.findOne(testUser1.id);
        expect(user.id).toBe(testUser1.id);
        expect(user.hasSubscription).toBe(true);

        // pubsub recevice
        expect(recevicePayload).toStrictEqual({
            userId: testUser1.id,
            productType: subscription.productType,
            productId: subscription.productId
        });
    });
   
})