import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ZaloConfig } from './entities/zalo-config.entity';
import { ZaloAdmin } from './entities/zalo-admin.entity';
import { ZaloTemplate } from './entities/zalo-template.entity';
import axios from 'axios';

@Injectable()
export class ZaloService {
  private http = axios.create({
    baseURL: 'https://openapi.zalo.me',
    timeout: 8000,
  });

  private configRepo: Repository<ZaloConfig>;
  private adminRepo: Repository<ZaloAdmin>;
  private tplRepo: Repository<ZaloTemplate>;

  constructor(ds: DataSource) {
    this.configRepo = ds.getRepository(ZaloConfig);
    this.adminRepo = ds.getRepository(ZaloAdmin);
    this.tplRepo = ds.getRepository(ZaloTemplate);
  }

  // ---------- Token ----------
  async getToken() {
    return this.configRepo.findOne({ where: { id: 1 } });
  }
  async updateToken(partial: Partial<ZaloConfig>) {
    const cfg = await this.getToken();
    const merged = this.configRepo.merge(cfg!, partial);
    return this.configRepo.save(merged);
  }

  // ---------- Admins ----------
  listAdmins() {
    return this.adminRepo.find({ order: { created_at: 'DESC' } });
  }
  async upsertAdmin(dto: { zalo_user_id: string; display_name?: string; is_active?: boolean }) {
    const existing = await this.adminRepo.findOne({ where: { zalo_user_id: dto.zalo_user_id } });
    if (existing) {
      existing.display_name = dto.display_name ?? existing.display_name;
      if (typeof dto.is_active === 'boolean') existing.is_active = dto.is_active;
      return this.adminRepo.save(existing);
    }
    const created = this.adminRepo.create({ zalo_user_id: dto.zalo_user_id, display_name: dto.display_name, is_active: dto.is_active ?? true });
    return this.adminRepo.save(created);
  }
  async removeAdmin(id: number) {
    await this.adminRepo.delete(id);
    return { ok: true };
  }

  // ---------- Templates ----------
  async getTemplate(key: string) {
    const tpl = await this.tplRepo.findOne({ where: { key } });
    if (!tpl) throw new NotFoundException('Template not found');
    return tpl;
  }
  async setTemplate(key: string, content: string) {
    const existed = await this.tplRepo.findOne({ where: { key } });
    if (existed) {
      existed.content = content;
      return this.tplRepo.save(existed);
    }
    return this.tplRepo.save(this.tplRepo.create({ key, content }));
  }

  // ---------- OA Send ----------
  private async getAccessToken() {
    const cfg = await this.getToken();
    if (!cfg?.oa_access_token) throw new Error('OA access token chưa được cấu hình');
    return cfg.oa_access_token;
  }

  async sendTextToUser(zalo_user_id: string, text: string) {
    const accessToken = await this.getAccessToken();
    const url = '/v2.0/oa/message';
    const body = {
      recipient: { user_id: zalo_user_id },
      message: { text },
    };
    const res = await this.http.post(url, body, { headers: { access_token: accessToken } });
    return res.data;
  }

  // ---------- Notify Order Success ----------
  /** render template ORDER_SUCCESS bằng dữ liệu order */
  renderOrderSuccess(order: any, tplContent: string) {
    const map: Record<string, string> = {
      '{{code}}': String(order.code ?? order.id),
      '{{customer}}': String(order.customerName ?? order.user?.name ?? 'N/A'),
      '{{total}}': (order.total ?? 0).toLocaleString('vi-VN'),
      '{{items}}': (order.items ?? []).map((i: any) => `${i.qty}x ${i.name}`).join(', '),
      '{{time}}': new Date(order.paidAt ?? order.createdAt ?? Date.now()).toLocaleString('vi-VN'),
      '{{link}}': (process.env.ADMIN_ORDER_URL ?? '').replace(':id', String(order.id)),
    };
    let out = tplContent;
    for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
    return out;
  }

  async notifyAdminsOrderSuccess(order: any) {
    const admins = await this.adminRepo.find({ where: { is_active: true } });
    if (!admins.length) return;

    const tpl = await this.getTemplate('ORDER_SUCCESS');
    const text = this.renderOrderSuccess(order, tpl.content);

    for (const a of admins) {
      try { await this.sendTextToUser(a.zalo_user_id, text); } catch (e) { /* swallow & log */ }
    }
  }
}
