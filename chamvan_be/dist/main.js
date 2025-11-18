"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const seed_1 = require("./seeds/seed");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('api');
    const allowedOrigins = [
        'http://localhost:3000',
        'https://chamvan.com',
        'https://www.chamvan.com',
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            }
            logger.warn(`Blocked CORS origin: ${origin}`);
            return callback(new Error('Not allowed by CORS'), false);
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
        credentials: true,
    });
    app.use((req, _res, next) => {
        if (process.env.CORS_DEBUG === '1') {
            logger.debug(`[DEBUG CORS] origin=${req.headers.origin} cookies=${req.headers.cookie}`);
        }
        next();
    });
    app.use('/api/orders/my', (req, _res, next) => {
        if (process.env.AUTH_DEBUG === '1') {
            const ck = req.cookies?.cv_token ||
                req.cookies?.cv_access_token ||
                req.cookies?.token ||
                null;
            logger.debug('[AUTH] >>> /api/orders/my ' + JSON.stringify({
                hasCookie: !!ck,
                cookieFirst16: ck?.slice?.(0, 16),
                authHeader: req.headers['authorization'],
            }));
        }
        next();
    });
    if (process.env.SEED_ADMIN_ON_BOOT === '1') {
        const dataSource = app.get(typeorm_1.DataSource);
        await (0, seed_1.seed)(dataSource);
    }
    const port = process.env.PORT ? Number(process.env.PORT) : 4000;
    await app.listen(port);
    logger.log(`API server listening on port ${port}`);
}
bootstrap().catch((err) => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map