import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/product.entity';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly itemRepo;
    private readonly productRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, productRepo: Repository<Product>);
    create(dto: CreateOrderDto, userId: number | null): Promise<{
        items: {
            name: string | undefined;
            id: number;
            order: Order;
            productId: number;
            qty: number;
            unitPrice: number;
            lineTotal: number;
        }[];
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: number): Promise<Order>;
    findMine(userId: number): Promise<{
        items: {
            name: string | undefined;
            unitPrice: number;
            qty: number;
            lineTotal: number;
            id: number;
            order: Order;
            productId: number;
        }[];
        subtotal: number;
        total: number;
        id: number;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        customerDob: string | null;
        shippingAddress: string | null;
        notes: string | null;
        shippingFee: number;
        status: string;
        eta: string | null;
        userId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAllForAdmin(): Promise<{
        items: {
            name: string | undefined;
            unitPrice: number;
            qty: number;
            lineTotal: number;
            id: number;
            order: Order;
            productId: number;
        }[];
        subtotal: number;
        total: number;
        id: number;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        customerDob: string | null;
        shippingAddress: string | null;
        notes: string | null;
        shippingFee: number;
        status: string;
        eta: string | null;
        userId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateStatus(id: number, body: {
        status?: string;
        eta?: string | null;
    }): Promise<Order>;
}
