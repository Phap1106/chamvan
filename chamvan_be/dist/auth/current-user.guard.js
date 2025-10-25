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
exports.CurrentUserGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let CurrentUserGuard = class CurrentUserGuard {
    jwt;
    constructor(jwt) {
        this.jwt = jwt;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const auth = req.headers['authorization'] || '';
        let token = null;
        if (auth.startsWith('Bearer '))
            token = auth.slice(7).trim();
        if (!token && req.cookies?.access_token)
            token = req.cookies.access_token;
        if (!token)
            throw new common_1.UnauthorizedException('Missing token');
        try {
            const payload = this.jwt.verify(token);
            const userId = payload?.id ??
                payload?.userId ??
                payload?.uid ??
                payload?.sub ??
                null;
            if (!userId)
                throw new common_1.UnauthorizedException('Invalid payload');
            req.user = { id: Number(userId) || userId, payload };
            return true;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid/expired token');
        }
    }
};
exports.CurrentUserGuard = CurrentUserGuard;
exports.CurrentUserGuard = CurrentUserGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], CurrentUserGuard);
//# sourceMappingURL=current-user.guard.js.map