import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersPublicController {
    private readonly orders;
    constructor(orders: OrdersService);
    create(dto: CreateOrderDto, req: any): Promise<{
        items: {
            name: string | undefined;
            id: number;
            order: import("./order.entity").Order;
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
    myOrders(req: any): Promise<{
        items: {
            name: string | undefined;
            unitPrice: number;
            qty: number;
            lineTotal: number;
            id: number;
            order: import("./order.entity").Order;
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
    findOne(id: string): Promise<import("./order.entity").Order>;
}
export declare class OrdersAdminController {
    private readonly orders;
    constructor(orders: OrdersService);
    findAll(): Promise<{
        items: {
            name: string | undefined;
            unitPrice: number;
            qty: number;
            lineTotal: number;
            id: number;
            order: import("./order.entity").Order;
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
    update(id: string, body: {
        status?: string;
        eta?: string | null;
    }): Promise<import("./order.entity").Order>;
}
