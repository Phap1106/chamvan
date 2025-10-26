"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.use('/api/orders/my', (req, _res, next) => {
        if (process.env.AUTH_DEBUG === '1') {
            const ck = req.cookies?.cv_token ||
                req.cookies?.cv_access_token ||
                req.cookies?.token ||
                null;
            console.log('[AUTH] >>> /api/orders/my', {
                hasCookie: !!ck,
                cookieFirst16: ck?.slice?.(0, 16),
                authHeader: req.headers['authorization'],
            });
        }
        next();
    });
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
//# sourceMappingURL=main.js.map