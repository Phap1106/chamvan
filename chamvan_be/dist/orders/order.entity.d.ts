import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    customerDob: string | null;
    shippingAddress: string | null;
    notes: string | null;
    subtotal: number;
    shippingFee: number;
    total: number;
    status: string;
    eta: string | null;
    userId: number | null;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
