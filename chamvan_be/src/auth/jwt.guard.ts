// 






// src/auth/jwt.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (process.env.AUTH_DEBUG === '1') {
      const req = context.switchToHttp().getRequest();
      const ck = req.cookies?.cv_token || req.cookies?.cv_access_token || req.cookies?.token;
      console.log('[AUTH] guard.handleRequest', {
        hasUser: !!user,
        err: err?.message || err,
        info: typeof info === 'string' ? info : info?.message || info?.name,
        cookieFirst16: ck?.slice?.(0, 16),
        authHeader: req.headers?.authorization,
        url: req.originalUrl,
      });
    }
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }
    return user;
  }
}
