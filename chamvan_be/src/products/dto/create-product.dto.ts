
// src/products/dto/create-product.dto.ts
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const IMG_RE = /^(https?:\/\/|data:image\/|\/uploads\/)/i;


class ColorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  hex?: string;
}

class SpecDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'price phải là số (dạng chuỗi hoặc số)' })
  price?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(IMG_RE, { message: 'image phải là URL http(s) hoặc data:image/... base64' })
  image?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12, { message: 'Tối đa 12 ảnh trong images[]' })
  @IsString({ each: true })
  @Matches(IMG_RE, { each: true, message: 'images[] phải là URL http(s) hoặc data:image/... base64' })
  images?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => ColorDto)
  @ValidateNested({ each: true })
  colors?: ColorDto[];

  @IsOptional()
  @IsArray()
  @Type(() => SpecDto)
  @ValidateNested({ each: true })
  specs?: SpecDto[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  categories?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sold?: number;

  @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';
}

