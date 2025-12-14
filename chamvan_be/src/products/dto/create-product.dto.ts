// import { IsInt,Min,IsArray, IsNotEmpty, IsIn, IsOptional, IsString, IsUrl, ArrayNotEmpty, IsNumberString, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// class CreateColorDto {
//   @IsString() name!: string;
//   @IsOptional() @IsString() hex?: string;
// }
// class CreateSpecDto {
//   @IsString() label!: string;
//   @IsString() value!: string;
// }

// export class CreateProductDto {
//   @IsString() @IsNotEmpty()
//   name!: string;

//   // DECIMAL → giữ string để không mất độ chính xác
//   @IsNumberString()
//   price!: string;

//   @IsOptional() @IsString()
//   sku?: string;

//   @IsOptional() @IsString()
//   description?: string;

//   @IsOptional() @IsUrl()
//   image?: string;

//   @IsOptional() @IsArray()
//   images?: string[];

//   // danh sách id category (số hoặc chuỗi số)
//   @IsArray() @ArrayNotEmpty()
//   categories!: (number | string)[];

//   @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateColorDto)
//   colors?: CreateColorDto[];

//   @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateSpecDto)
//   specs?: CreateSpecDto[];

//     @IsOptional() @IsInt() @Min(0)
//   stock?: number;

//   @IsOptional() @IsInt() @Min(0)
//   sold?: number;
//     @IsOptional()
//   @IsIn(['open', 'closed'])
//   status?: 'open' | 'closed';
// }








import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const IMG_RE = /^(https?:\/\/|data:image\/)/i;

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
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // ✅ cho phép URL hoặc base64
  @IsOptional()
  @IsString()
  @Matches(IMG_RE, { message: 'image phải là URL http(s) hoặc data:image/... base64' })
  image?: string;

  // ✅ cho phép URL hoặc base64 + giới hạn số lượng để tránh payload nổ
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12, { message: 'Tối đa 12 ảnh trong images[]' })
  @IsString({ each: true })
  @Matches(IMG_RE, {
    each: true,
    message: 'images[] phải là URL http(s) hoặc data:image/... base64',
  })
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
  @IsInt({ each: true })
  categories?: number[];

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsInt()
  sold?: number;

  @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';
}
