import User from '../src/entities/user';
import UserRepository from '../src/repositories/user';
import PubSub from '../src/PubSub';
import TokenService from '../src/services/token';

// Task1
describe('Test TokenService', () => {
    let userRepository: UserRepository;
    let testUser1: User;
    let testUser2: User;
    let pubSub: PubSub;

    let tokenService: TokenService;

    beforeEach(()=>{
        userRepository = new UserRepository();
        testUser1 = userRepository.create('test1');
        testUser2 = userRepository.create('test2');

        pubSub = new PubSub();

        tokenService = new TokenService(userRepository, pubSub);
        tokenService.balances.set(testUser1.id, 1000);
        tokenService.balances.set(testUser2.id, 800);
    })

    test('retrieve the balance of a specific account', () => {
        const testUser1Balance = tokenService.getUserBalance(testUser1.id);
        const testUser2Balance = tokenService.getUserBalance(testUser2.id);

        expect(testUser1Balance).toBe(1000);
        expect(testUser2Balance).toBe(800);
    });

    test('retrieve the total balance of all accounts', () => {
        const balance = tokenService.getAllUsersTotalBalance();

        expect(balance).toBe(1800);
    });

    test('transfer tokens to another account', () => {
        const balance = tokenService.transferToken(testUser1.id, testUser2.id, 300);

        expect(balance).toBe(tokenService.balances.get(testUser1.id));
        expect(balance).toBe(700);
        expect(balance).toBe(tokenService.getUserBalance(testUser1.id));

        expect(tokenService.balances.get(testUser2.id)).toBe(1100);
        expect(tokenService.balances.get(testUser2.id)).toBe(tokenService.getUserBalance(testUser2.id));
    });

    test('transfer tokens to another account then publish events', () => {
        let recevicePayload = null;
        pubSub.subscribe('transfer_done', (payload)=>{
            recevicePayload = payload;
        })
        const balance = tokenService.transferToken(testUser1.id, testUser2.id, 300);

        expect(recevicePayload).toStrictEqual({
            transferUserId: testUser1.id,
            recevierUserId: testUser2.id,
            transferNum: 300,
            transferBalance: balance,
        });
    });
   
})