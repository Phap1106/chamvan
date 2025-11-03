// // src/integrations/telegram/telegram.controller.ts
// import { BadRequestException, Controller, Get, Put, Body, Query } from '@nestjs/common';
// import { TelegramService } from './telegram.service';

// @Controller('admin/telegram')
// export class TelegramAdminController {
//   constructor(private readonly tg: TelegramService) {}

//   @Get('token')
//   async getToken() {
//     try {
//       return await this.tg.getToken();
//     } catch (e: any) {
//       throw new BadRequestException(e?.message || 'getToken failed');
//     }
//   }

//   @Put('token')
//   async setToken(@Body() dto: { bot_token?: string | null }) {
//     try {
//       return await this.tg.updateToken({ bot_token: dto.bot_token ?? null });
//     } catch (e: any) {
//       throw new BadRequestException(e?.message || 'updateToken failed');
//     }
//   }

//   @Get('templates')
//   async getTpl(@Query('key') key = 'ORDER_SUCCESS') {
//     try {
//       return await this.tg.getTemplate(key);
//     } catch (e: any) {
//       throw new BadRequestException(e?.message || 'getTemplate failed');
//     }
//   }
// }







// src/integrations/telegram/telegram.controller.ts
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('admin/telegram')
export class TelegramAdminController {
  constructor(private readonly tg: TelegramService) {}

  /* ---------- Token ---------- */
  @Get('token')
  async getToken() {
    try { return await this.tg.getToken(); }
    catch (e: any) { throw new BadRequestException(e?.message || 'getToken failed'); }
  }

  @Put('token')
  async setToken(@Body() dto: { bot_token?: string | null }) {
    try { return await this.tg.updateToken({ bot_token: dto.bot_token ?? null }); }
    catch (e: any) { throw new BadRequestException(e?.message || 'updateToken failed'); }
  }

  /* ---------- Recipients ---------- */
  @Get('recipients')
  listRecipients() {
    return this.tg.listRecipients();
  }

  @Post('recipients')
  upsertRecipient(@Body() dto: { chat_id: string; display_name?: string; is_active?: boolean }) {
    return this.tg.upsertRecipient(dto);
  }

  @Delete('recipients/:id')
  async removeRecipient(@Param('id') id: string) {
    await this.tg.removeRecipient(Number(id));
    return { ok: true };
  }

  /* ---------- Templates ---------- */
  @Get('templates')
  async getTpl(@Query('key') key = 'ORDER_SUCCESS') {
    return this.tg.getTemplate(key);
  }

  @Put('templates')
  async setTpl(@Body() dto: { key: string; content: string }) {
    return this.tg.setTemplate(dto.key, dto.content);
  }

  /* ---------- Ping & Updates ---------- */
  @Post('ping')
  async ping(@Body() dto: { chat_id?: string; text?: string }) {
    const text = dto.text || 'Ping từ CHẠM VÂN';
    if (dto.chat_id) return this.tg.sendText(String(dto.chat_id), text);
    // broadcast tới tất cả recipients đang active
    const recs = await this.tg.listRecipients();
    const actives = recs.filter(r => r.is_active);
    for (const r of actives) { try { await this.tg.sendText(String(r.chat_id), text); } catch {} }
    return { ok: true, count: actives.length };
  }

  @Get('updates')
  async updates(@Query('offset') offset?: string) {
    return this.tg.getUpdates(offset ? Number(offset) : undefined);
  }
}
