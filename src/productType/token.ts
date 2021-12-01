import Product from './product';
import TokenService from '../services/token';

class Token extends Product {
    tokenService: TokenService;
    pointNum: number = 100;

    constructor(tokenService: TokenService, pointNum: number = 100) {
        super();
        this.tokenService = tokenService;
        this.pointNum = pointNum;
    }

    public get productType(): string {
        return 'Tokens';
    }

    onBuy(userId: number) {
        this.tokenService.addUserToken(userId, this.pointNum);
    }
}

export default Token;