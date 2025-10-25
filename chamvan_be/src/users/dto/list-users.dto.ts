// src/users/dto/list-users.dto.ts
import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../common/role.enum';

export class ListUsersQueryDto {
  @IsOptional() @IsString()
  q?: string;

  @IsOptional() @IsEnum(Role)
  role?: Role;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  page?: number;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  limit?: number;
}
