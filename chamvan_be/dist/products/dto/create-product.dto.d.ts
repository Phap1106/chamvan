declare class CreateColorDto {
    name: string;
    hex?: string;
}
declare class CreateSpecDto {
    label: string;
    value: string;
}
export declare class CreateProductDto {
    name: string;
    price: string;
    sku?: string;
    description?: string;
    image?: string;
    images?: string[];
    categories: (number | string)[];
    colors?: CreateColorDto[];
    specs?: CreateSpecDto[];
    stock?: number;
    sold?: number;
    status?: 'open' | 'closed';
}
export {};
