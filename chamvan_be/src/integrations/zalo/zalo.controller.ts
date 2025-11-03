import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { SendManualDto, UpdateTemplateDto, UpdateTokenDto, UpsertAdminDto } from './dto/zalo.dto';

@Controller('admin/zalo') // -> /api/admin/zalo/...
export class ZaloAdminController {
  constructor(private readonly zalo: ZaloService) {}

  // Token
  @Get('token')
  getToken() { return this.zalo.getToken(); }

  @Put('token')
  updateToken(@Body() dto: UpdateTokenDto) { return this.zalo.updateToken(dto); }

  // Admin recipients
  @Get('recipients')
  listAdmins() { return this.zalo.listAdmins(); }

  @Post('recipients')
  upsertAdmin(@Body() dto: UpsertAdminDto) { return this.zalo.upsertAdmin(dto); }

  @Delete('recipients/:id')
  removeAdmin(@Param('id') id: string) { return this.zalo.removeAdmin(Number(id)); }

  // Templates
  @Get('templates')
  async getTpl(@Query('key') key = 'ORDER_SUCCESS') { return this.zalo.getTemplate(key); }

  @Put('templates')
  setTpl(@Body() dto: UpdateTemplateDto) { return this.zalo.setTemplate(dto.key, dto.content); }

  // Send manual
  @Post('send')
  sendManual(@Body() dto: SendManualDto) { return this.zalo.sendTextToUser(dto.zalo_user_id, dto.text); }

  // Quick ping test
  @Post('ping')
  ping(@Body('zalo_user_id') id: string) { return this.zalo.sendTextToUser(id, 'Ping từ hệ thống 👋'); }
}

// (Tuỳ nhu cầu: webhook nhận tin nhắn "ADMIN ON" để auto đăng ký)
@Controller('integrations/zalo')
export class ZaloWebhookController {
  constructor(private readonly zalo: ZaloService) {}

  @Post('webhook')
  async webhook(@Body() payload: any) {
    // TODO: verify signature theo tài liệu OA (tùy cấu hình)
    const text = payload?.message?.text?.trim();
    const userId = payload?.sender?.id || payload?.user_id;
    const name = payload?.sender?.name;

    if (text?.toUpperCase() === 'ADMIN ON' && userId) {
      await this.zalo.upsertAdmin({ zalo_user_id: String(userId), display_name: name, is_active: true });
      await this.zalo.sendTextToUser(String(userId), 'Đã đăng ký nhận thông báo đơn hàng thành công ✅');
    }
    if (text?.toUpperCase() === 'ADMIN OFF' && userId) {
      await this.zalo.upsertAdmin({ zalo_user_id: String(userId), display_name: name, is_active: false });
      await this.zalo.sendTextToUser(String(userId), 'Đã tắt nhận thông báo ✅');
    }
    return { ok: true };
  }
}
