import { IsInt,Min,IsArray, IsNotEmpty, IsIn, IsOptional, IsString, IsUrl, ArrayNotEmpty, IsNumberString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateColorDto {
  @IsString() name!: string;
  @IsOptional() @IsString() hex?: string;
}
class CreateSpecDto {
  @IsString() label!: string;
  @IsString() value!: string;
}

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  name!: string;

  // DECIMAL → giữ string để không mất độ chính xác
  @IsNumberString()
  price!: string;

  @IsOptional() @IsString()
  sku?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsUrl()
  image?: string;

  @IsOptional() @IsArray()
  images?: string[];

  // danh sách id category (số hoặc chuỗi số)
  @IsArray() @ArrayNotEmpty()
  categories!: (number | string)[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateColorDto)
  colors?: CreateColorDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateSpecDto)
  specs?: CreateSpecDto[];

    @IsOptional() @IsInt() @Min(0)
  stock?: number;

  @IsOptional() @IsInt() @Min(0)
  sold?: number;
    @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';
}
