import { Order } from './order.entity';
export declare class OrderItem {
    id: number;
    order: Order;
    productId: number;
    qty: number;
    unitPrice: number;
    lineTotal: number;
}
