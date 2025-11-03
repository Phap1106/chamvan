import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  // Cho phép số, khoảng trắng, dấu +, -, () để phù hợp nhiều định dạng
  @Matches(/^[0-9+\-() ]*$/, {
    message: 'phone chỉ được chứa số và các ký tự + - ( ) khoảng trắng',
  })
  phone?: string;

  /**
   * Lưu ý: cột `dob` đang là type 'date' trong entity.
   * FE gửi ISO 'YYYY-MM-DD' là chuẩn.
   */
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'dob phải là YYYY-MM-DD' })
  dob?: string;
}
