import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTokenDto {
  @IsOptional() @IsString() oa_access_token?: string;
  @IsOptional() @IsString() oa_refresh_token?: string;
  @IsOptional() @IsString() oa_expires_at?: string; // epoch ms string
}

export class UpsertAdminDto {
  @IsString() @IsNotEmpty()
  zalo_user_id: string;

  @IsOptional() @IsString()
  display_name?: string;

  @IsOptional() @IsBoolean()
  is_active?: boolean;
}

export class UpdateTemplateDto {
  @IsString() @IsNotEmpty()
  key: string;

  @IsString() @IsNotEmpty()
  content: string;
}

export class SendManualDto {
  @IsString() @IsNotEmpty()
  zalo_user_id: string;

  @IsString() @IsNotEmpty()
  text: string;
}
