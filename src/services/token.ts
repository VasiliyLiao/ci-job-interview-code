import PubSub from '../PubSub';
import UserRepository from '../repositories/user';

class TokenService {
    balances: Map<number, number> = new Map;
    userRepository: UserRepository;
    pubSub: PubSub;

    constructor(userRepository: UserRepository, pubSub: PubSub) {
        this.userRepository = userRepository;
        this.pubSub = pubSub;
    }

    private getBalanceWithDefaultValue(userId: number): number {
        return this.balances.get(userId) || 0;
    }
    
    private addToken(userId: number, addNum: number): number {
        let balance = this.getBalanceWithDefaultValue(userId);
        balance = balance + addNum;
        this.balances.set(userId, balance);

        return balance;
    }

    private removeToken(userId: number, removeNum: number): number {
        let balance = this.getBalanceWithDefaultValue(userId);
        if (removeNum > balance) {
            throw new Error("removeNum must less than or equal to balance");
        }
        balance = balance - removeNum;
        this.balances.set(userId, balance);

        return balance;
    }

    addUserToken(userId: number, addNum: number) {
        // verify user
        this.userRepository.findOne(userId);
        return this.addToken(userId, addNum);
    }

    // Class must provide a method to transfer tokens to another account;
    transferToken(transferUserId: number, recevierUserId: number, transferNum: number): number{
        if (transferUserId === recevierUserId) {
            throw new Error("recevier must not be same as transfer");  
        } 
        if (transferNum <= 0) {
            throw new Error("transferNum must greater than 0");
        }

        // verify users
        this.userRepository.findOne(transferUserId);
        this.userRepository.findOne(recevierUserId);

        const transferBalance = this.removeToken(transferUserId, transferNum);
        this.addToken(recevierUserId, transferNum);

        // The Token service (task 1) can publish a event when a transfer has been done
        this.pubSub.publish('transfer_done', {
            transferUserId,
            recevierUserId,
            transferNum,
            transferBalance,
        });

        return transferBalance;
    }

    // Class must provide a method to retrieve the balance of a specific account;
    getUserBalance(userId: number) {
        // verify user
        this.userRepository.findOne(userId);
        return this.getBalanceWithDefaultValue(userId)
    }

    // Class must provide a method to retrieve the total balance of all accounts;
    getAllUsersTotalBalance() {
        const users = this.userRepository.findAll();
        let totalBalance = 0;
        // TODO: use reduce function replact it
        users.forEach(user=> totalBalance += this.getBalanceWithDefaultValue(user.id));

        return totalBalance;
    }
}

export default TokenService;