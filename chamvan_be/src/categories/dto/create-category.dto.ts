import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  // nhận "1" hoặc 1 đều ok
  @IsOptional()
  @IsNumberString()
  parentId?: string;
}
