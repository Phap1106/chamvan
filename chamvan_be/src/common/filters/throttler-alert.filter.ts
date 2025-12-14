// chamvan_be/src/common/filters/throttler-alert.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { TelegramService } from '../../integrations/telegram/telegram.service';

function getClientIp(req: Request): string {
  const fwd = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
  return (
    fwd ||
    (req.headers['x-real-ip'] as string | undefined) ||
    req.ip ||
    (req.connection as any)?.remoteAddress ||
    'unknown'
  );
}

@Catch(ThrottlerException)
export class ThrottlerAlertFilter implements ExceptionFilter {
  constructor(private readonly telegram: TelegramService) {}

  async catch(_ex: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const ip = getClientIp(req);
    const ua = (req.headers['user-agent'] as string | undefined) || 'unknown';
    const path = req.originalUrl || req.url;
    const method = req.method;

    // Chỉ cảnh báo mạnh cho các endpoint nhạy cảm (tạo đơn)
    const isSensitive =
      path.includes('/api/orders') && method === 'POST';

    if (isSensitive) {
      const payload = {
        type: 'RATE_LIMIT_BLOCK',
        ip,
        userAgent: ua,
        method,
        path,
        origin: req.headers['origin'] || null,
        referer: req.headers['referer'] || null,
        acceptLanguage: req.headers['accept-language'] || null,
        forwardedFor: req.headers['x-forwarded-for'] || null,
        realIp: req.headers['x-real-ip'] || null,
        time: new Date().toISOString(),
      };

      // ✅ Không phụ thuộc cứng method nào trong TelegramService (tránh lỗi compile)
      try {
        const t: any = this.telegram as any;
        const fn =
          t?.notifyAdminsSecurityAlert ||
          t?.notifyAdminsAbuse ||
          t?.notifyAdminsText ||
          t?.notifyAdminsMessage;

        if (typeof fn === 'function') {
          await fn.call(this.telegram, payload);
        } else {
          // fallback: log nếu chưa có hàm
          // (Bạn có thể bổ sung hàm notifyAdminsSecurityAlert trong TelegramService sau)
          // eslint-disable-next-line no-console
          console.warn('[SECURITY] Throttled but no telegram alert method found', payload);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[SECURITY] Telegram alert failed', e);
      }
    }

    return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
      error: 'Too Many Requests',
    });
  }
}
