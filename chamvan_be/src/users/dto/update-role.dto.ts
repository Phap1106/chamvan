// src/users/dto/update-role.dto.ts
import { IsEnum } from 'class-validator';
import { Role } from '../../common/role.enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  role!: Role;
}
