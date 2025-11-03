// // src/users/dto/update-user.dto.ts
// import { IsDateString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

// export class UpdateUserDto {
//   @IsOptional() @IsString()
//   fullName?: string;

//   @IsOptional() @IsPhoneNumber('VN')
//   phone?: string;

//   @IsOptional() @IsDateString()
//   dob?: string;
// }







// src/users/dto/update-user.dto.ts
import { IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // cho phép update password (optional) — backend sẽ hash trước khi lưu
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
}