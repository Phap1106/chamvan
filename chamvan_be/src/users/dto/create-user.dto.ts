// chamvan_be/src/users/dto/create-user.dto.ts
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';


export class CreateUserDto {
@IsString() @IsNotEmpty()
fullName: string;


@IsEmail()
email: string;


@IsString() @MinLength(6)
password: string;


@IsOptional() @IsPhoneNumber('VN')
phone?: string;


@IsOptional() @IsDateString()
dob?: string; // YYYY-MM-DD
}