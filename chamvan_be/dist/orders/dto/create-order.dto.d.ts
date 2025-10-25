export declare class CreateOrderItemDto {
    productId: string | number;
    qty: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerDob?: string;
    shippingAddress?: string;
    notes?: string;
    items: CreateOrderItemDto[];
    userId?: number;
}
export declare class UpdateAdminOrderDto {
    status?: string;
    eta?: string | null;
}
