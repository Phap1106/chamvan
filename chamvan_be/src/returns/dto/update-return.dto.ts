import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateReturnDto {
  @IsString() @IsNotEmpty()
  @IsIn(['pending','in_review','approved','rejected','refunded'])
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'refunded';
}
