// //src/orders/dto/create-order.dto.ts
// import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// export class CreateOrderItemDto {
//   @IsNotEmpty()
//   @IsString()
//   productId: string | number;

//   @IsNumber()
//   @Min(1)
//   qty: number;
// }

// export class CreateOrderDto {
//   @IsString()
//   @IsNotEmpty()
//   customerName: string;

//   @IsEmail()
//   customerEmail: string;

//   @IsString()
//   @IsOptional()
//   customerPhone?: string;

//   @IsString()
//   @IsOptional()
//   customerDob?: string;

//   @IsString()
//   @IsOptional()
//   shippingAddress?: string;

//   @IsString()
//   @IsOptional()
//   notes?: string;

//   @IsArray()
//   items: CreateOrderItemDto[];

//   @IsOptional()
//   @IsNumber()
//   userId?: number;
// }

// export class UpdateAdminOrderDto {
//   @IsOptional()
//   @IsString()
//   status?: string;

//   @IsOptional()
//   @IsString()
//   eta?: string | null; // ISO
// }












import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOrderItemDto {
  // FE có thể gửi number hoặc string -> ép về string để không bị 400
  @Transform(({ value }) => (value === undefined || value === null ? '' : String(value).trim()))
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  qty: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  // alias cũ (nếu FE đang gửi name/email/phone)
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  customerDob?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingFee?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  eta?: string | null;
}
