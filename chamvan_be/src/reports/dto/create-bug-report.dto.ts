// import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// export class CreateBugReportDto {
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(255)
//   title!: string;

//   @IsString()
//   @IsNotEmpty()
//   description!: string;

//   @IsString()
//   @IsOptional()
//   @MaxLength(255)
//   pageUrl?: string;

//   @IsString()
//   @IsOptional()
//   @MaxLength(255)
//   userAgent?: string;
// }
 




import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBugReportDto {
  @IsString() @IsNotEmpty() @MaxLength(255)
  title: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsString() @IsOptional() @MaxLength(255)
  pageUrl?: string;
}
