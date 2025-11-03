// import { IsIn, IsOptional, IsString } from 'class-validator';

// export class UpdateReportDto {
//   @IsOptional() @IsIn(['open','in_progress','resolved','closed'])
//   status?: 'open'|'in_progress'|'resolved'|'closed';

//   @IsOptional() @IsString()
//   note?: string; // để mở rộng về sau
// }




import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateReportStatusDto {
  @IsString()
  @IsIn(['open', 'doing', 'resolved', 'closed'])
  status: string;
}
