// // src/auth/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: JWT_SECRET, // luôn là string
//     });
//   }

//   async validate(payload: any) {
//     return { id: payload.sub, email: payload.email, role: payload.role };
//   }
// }







// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

function cookieExtractor(req: any): string | null {
  try {
    const c = req?.cookies ?? {};
    const token = c.cv_token || c.cv_access_token || c.token || null;
    if (process.env.AUTH_DEBUG === '1') {
      console.log('[AUTH] cookieExtractor:', {
        found: !!token,
        name: token
          ? (c.cv_token && 'cv_token') || (c.cv_access_token && 'cv_access_token') || (c.token && 'token')
          : null,
        first16: token?.slice?.(0, 16),
      });
    }
    return token;
  } catch {
    return null;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => cookieExtractor(req),               // 1) Cookie
        ExtractJwt.fromAuthHeaderAsBearerToken(),    // 2) Bearer
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    };

    if (process.env.AUTH_DEBUG === '1') {
      console.log('[AUTH] JwtStrategy init', {
        secretHasValue: !!process.env.JWT_SECRET,
        secretLen: process.env.JWT_SECRET?.length,
      });
    }

    super(opts);
  }

  async validate(payload: any) {
    if (process.env.AUTH_DEBUG === '1') {
      console.log('[AUTH] validate payload:', {
        sub: payload?.sub,
        email: payload?.email,
        role: payload?.role,
        keys: Object.keys(payload || {}),
      });
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
