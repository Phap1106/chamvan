import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBotTokenDto {
  @IsOptional() @IsString()
  bot_token?: string;
}

export class UpsertRecipientDto {
  @IsString() @IsNotEmpty()
  chat_id: string;

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
  chat_id: string;

  @IsString() @IsNotEmpty()
  text: string;
}
