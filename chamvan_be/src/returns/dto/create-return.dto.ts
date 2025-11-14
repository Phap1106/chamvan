import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateReturnDto {
  @IsString() @IsNotEmpty() @MaxLength(50)
  orderCode: string;

  @IsString() @IsNotEmpty()
  reason: string;
}
