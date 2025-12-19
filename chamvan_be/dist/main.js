"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const seed_1 = require("./seeds/seed");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('trust proxy', true);
    app.setGlobalPrefix('api');
    const BODY_LIMIT = process.env.BODY_LIMIT || '50mb';
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_1.json)({ limit: BODY_LIMIT }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: BODY_LIMIT }));
    app.use((err, _req, res, next) => {
        if (err?.type === 'entity.too.large') {
            return res.status(413).json({
                message: 'Payload too large (ảnh/base64 quá nặng). Hãy giảm dung lượng ảnh hoặc giảm số ảnh.',
            });
        }
        return next(err);
    });
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://chamvan.com',
            'https://www.chamvan.com',
            'https://admin.chamvan.com',
        ],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidUnknownValues: false,
    }));
    if (process.env.SEED_ADMIN_ON_BOOT === '1') {
        try {
            const dataSource = app.get(typeorm_1.DataSource);
            await (0, seed_1.seed)(dataSource);
            logger.log('Admin seeded successfully');
        }
        catch (e) {
            logger.error('Seeding failed', e);
        }
    }
    const port = Number(process.env.PORT || 4000);
    await app.listen(port, '0.0.0.0');
    logger.log(`✅ API ready on port ${port} (Prefix: /api)`);
}
bootstrap().catch((err) => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map