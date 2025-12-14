"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerAlertFilter = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const telegram_service_1 = require("../../integrations/telegram/telegram.service");
function getClientIp(req) {
    const fwd = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
    return (fwd ||
        req.headers['x-real-ip'] ||
        req.ip ||
        req.connection?.remoteAddress ||
        'unknown');
}
let ThrottlerAlertFilter = class ThrottlerAlertFilter {
    telegram;
    constructor(telegram) {
        this.telegram = telegram;
    }
    async catch(_ex, host) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const ip = getClientIp(req);
        const ua = req.headers['user-agent'] || 'unknown';
        const path = req.originalUrl || req.url;
        const method = req.method;
        const isSensitive = path.includes('/api/orders') && method === 'POST';
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
            try {
                const t = this.telegram;
                const fn = t?.notifyAdminsSecurityAlert ||
                    t?.notifyAdminsAbuse ||
                    t?.notifyAdminsText ||
                    t?.notifyAdminsMessage;
                if (typeof fn === 'function') {
                    await fn.call(this.telegram, payload);
                }
                else {
                    console.warn('[SECURITY] Throttled but no telegram alert method found', payload);
                }
            }
            catch (e) {
                console.error('[SECURITY] Telegram alert failed', e);
            }
        }
        return res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
            statusCode: 429,
            message: 'Too many requests. Please try again later.',
            error: 'Too Many Requests',
        });
    }
};
exports.ThrottlerAlertFilter = ThrottlerAlertFilter;
exports.ThrottlerAlertFilter = ThrottlerAlertFilter = __decorate([
    (0, common_1.Catch)(throttler_1.ThrottlerException),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], ThrottlerAlertFilter);
//# sourceMappingURL=throttler-alert.filter.js.map