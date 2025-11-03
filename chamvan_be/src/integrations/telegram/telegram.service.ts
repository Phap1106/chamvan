import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataSource, Repository } from 'typeorm';
import { TelegramConfig } from './entities/telegram-config.entity';
import { TelegramRecipient } from './entities/telegram-recipient.entity';
import { TelegramTemplate } from './entities/telegram-template.entity';

@Injectable()
export class TelegramService {
  private cfgRepo: Repository<TelegramConfig>;
  private recRepo: Repository<TelegramRecipient>;
  private tplRepo: Repository<TelegramTemplate>;

  constructor(ds: DataSource) {
    this.cfgRepo = ds.getRepository(TelegramConfig);
    this.recRepo = ds.getRepository(TelegramRecipient);
    this.tplRepo = ds.getRepository(TelegramTemplate);
  }

  // ===== Token =====
  async getToken() {
    const cfg = await this.cfgRepo.findOne({ where: { id: 1 } });
    return cfg;
  }
  async updateToken(partial: Partial<TelegramConfig>) {
    const existed = await this.getToken();
    const merged = this.cfgRepo.merge(existed ?? this.cfgRepo.create({ id: 1 }), partial);
    return this.cfgRepo.save(merged);
  }
  private async token() {
    const cfg = await this.getToken();
    const t = cfg?.bot_token || process.env.TELEGRAM_BOT_TOKEN;
    if (!t) throw new Error('Telegram bot token chưa được cấu hình!');
    return t;
  }

  // ===== Recipients =====
  listRecipients() { return this.recRepo.find({ order: { created_at: 'DESC' } }); }
  async upsertRecipient(dto: { chat_id: string; display_name?: string; is_active?: boolean }) {
    const existed = await this.recRepo.findOne({ where: { chat_id: String(dto.chat_id) } });
    if (existed) {
      existed.display_name = dto.display_name ?? existed.display_name;
      if (typeof dto.is_active === 'boolean') existed.is_active = dto.is_active;
      return this.recRepo.save(existed);
    }
    return this.recRepo.save(this.recRepo.create({
      chat_id: String(dto.chat_id),
      display_name: dto.display_name,
      is_active: dto.is_active ?? true,
    }));
  }
  async removeRecipient(id: number) { await this.recRepo.delete(id); return { ok: true }; }

  // ===== Templates =====
  async getTemplate(key: string) {
    let tpl = await this.tplRepo.findOne({ where: { key } });
    if (!tpl) tpl = await this.tplRepo.save(this.tplRepo.create({ key, content: '' }));
    return tpl;
  }
  setTemplate(key: string, content: string) {
    return this.tplRepo.save(this.tplRepo.create({ key, content }));
  }

  // ===== Telegram API =====
  private async api(path: string, body?: any) {
    const token = await this.token();
    const url = `https://api.telegram.org/bot${token}${path}`;
    const res = await axios.post(url, body);
    return res.data;
  }

  async sendText(chat_id: string, text: string) {
    return this.api('/sendMessage', { chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true });
  }

  // Hỗ trợ lấy updates để phát hiện chat_id mới (admin vừa nhắn bot)
  async getUpdates(offset?: number) {
    const token = await this.token();
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const res = await axios.get(url, { params: { offset: offset ?? undefined, timeout: 0 } });
    return res.data; // trả về để FE tiện hiển thị
  }

  // ===== Render & Notify =====
  renderOrderSuccess(order: any, tplContent: string) {
    const map: Record<string, string> = {
      '{{code}}': String(order.code ?? order.id),
      '{{customer}}': String(order.customerName ?? order.user?.name ?? 'N/A'),
      '{{total}}': (order.total ?? 0).toLocaleString('vi-VN'),
      '{{items}}': (order.items ?? []).map((i: any) => `${i.qty}x ${i.name}`).join(', '),
      '{{time}}': new Date(order.paidAt ?? order.createdAt ?? Date.now()).toLocaleString('vi-VN'),
      '{{link}}': (process.env.ADMIN_ORDER_URL ?? '').replace(':id', String(order.id)),
    };
    let out = tplContent || 'Đơn hàng #{{code}} tổng {{total}}₫';
    for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
    return out;
  }

  async notifyAdminsOrderSuccess(order: any) {
    const recs = await this.recRepo.find({ where: { is_active: true } });
    if (!recs.length) return;
    const tpl = await this.getTemplate('ORDER_SUCCESS');
    const text = this.renderOrderSuccess(order, tpl.content);

    for (const r of recs) {
      try { await this.sendText(String(r.chat_id), text); } catch {}
    }
  }
}
