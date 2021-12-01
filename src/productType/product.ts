import { v4 as uuid } from 'uuid';

export default abstract class Product {
    productId: string;

    constructor() {
        this.productId = uuid();
    }
    
    public abstract get productType(): string

    public abstract onBuy(userId: number): any;
}