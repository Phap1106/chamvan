import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SendManualDto, UpdateBotTokenDto, UpdateTemplateDto, UpsertRecipientDto } from './dto/telegram.dto';

@Controller('admin/telegram')
export class TelegramAdminController {
  constructor(private readonly tg: TelegramService) {}

  // Token
  @Get('token') getToken() { return this.tg.getToken(); }
  @Put('token') updateToken(@Body() dto: UpdateBotTokenDto) { return this.tg.updateToken(dto); }

  // Recipients
  @Get('recipients') listRecipients() { return this.tg.listRecipients(); }
  @Post('recipients') upsertRecipient(@Body() dto: UpsertRecipientDto) { return this.tg.upsertRecipient(dto); }
  @Delete('recipients/:id') removeRecipient(@Param('id') id: string) { return this.tg.removeRecipient(Number(id)); }

  // Templates
  @Get('templates') getTpl(@Query('key') key = 'ORDER_SUCCESS') { return this.tg.getTemplate(key); }
  @Put('templates') setTpl(@Body() dto: UpdateTemplateDto) { return this.tg.setTemplate(dto.key, dto.content); }

  // Send manual / ping
  @Post('send') sendManual(@Body() dto: SendManualDto) { return this.tg.sendText(dto.chat_id, dto.text); }
  @Post('ping') ping(@Body('chat_id') id: string) { return this.tg.sendText(id, 'Ping từ hệ thống 👋'); }

  // Hỗ trợ lấy updates để tìm chat_id mới
  @Get('updates') getUpdates(@Query('offset') offset?: string) {
    return this.tg.getUpdates(offset ? Number(offset) : undefined);
  }
}
