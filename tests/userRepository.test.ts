import User from '../src/entities/user';
import UserRepository from '../src/repositories/user';

describe('Test User Respository', () => {
    let userRepository: UserRepository;
    let testUser1: User;
    let testUser2: User;

    beforeEach(()=>{
        testUser1 = new User(1, 'test', false);
        testUser2 = new User(2, 'aa', true);
        userRepository = new UserRepository();
        userRepository.users.set(testUser1.id, testUser1);
        userRepository.users.set(testUser2.id, testUser2);
    })

    test('FindAll Method', () => {
        const users = userRepository.findAll();

        expect(users.length).toBe(2);
        expect(users[0]).toBe(testUser1);
        expect(users[1]).toBe(testUser2);
    })

    test('FindOne Method', () => {
        const user = userRepository.findOne(testUser2.id);

        expect(user).toBe(testUser2);
    })

    test('Create Method', () => {
        const user = userRepository.create('test create');

        expect(userRepository.users.size).toBe(3);
        expect(userRepository.users.get(user.id)).toBe(user);
    })

    test('activeUserSubscription Method', () => {
        expect(testUser1.hasSubscription).toBe(false);
        userRepository.activeUserSubscription(testUser1.id);
        expect(testUser1.hasSubscription).toBe(true);
    })
   
})