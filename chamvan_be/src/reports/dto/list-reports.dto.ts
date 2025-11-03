// import { IsInt, IsIn, IsOptional, IsString, Min } from 'class-validator';

// export class ListReportsDto {
//   @IsOptional() @IsInt() @Min(1)
//   page?: number = 1;

//   @IsOptional() @IsInt() @Min(1)
//   limit?: number = 20;

//   @IsOptional() @IsString()
//   q?: string;

//   @IsOptional() @IsIn(['open','in_progress','resolved','closed'])
//   status?: 'open'|'in_progress'|'resolved'|'closed';
// }






import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListReportsDto {
  @IsOptional() @IsString()
  status?: string; // open/doing/resolved/closed

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 20;
}
