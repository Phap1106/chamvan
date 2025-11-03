
// // src/auth/auth.controller.ts
// import type { Response } from 'express';
// import { Body, Controller, Post, Res } from '@nestjs/common';
// import { IsEmail, IsString } from 'class-validator';
// import { AuthService } from './auth.service';

// class LoginDto {
//   @IsEmail() email!: string;
//   @IsString() password!: string;
// }

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly auth: AuthService) {}

//   @Post('login')
//   async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
//     const user = await this.auth.validateUser(dto.email, dto.password);
//     const { access_token, user: safeUser } = await this.auth.login(user);

//     if (process.env.AUTH_DEBUG === '1') {
//       console.log('[AUTH] set-cookie cv_token first16:', access_token.slice(0, 16));
//     }

//     res.cookie('cv_token', access_token, {
//       httpOnly: true,
//       sameSite: 'lax',
//       path: '/',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return { access_token, user: safeUser };
//   }
// }








import type { Response } from 'express';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}
class ForgotDto {
  @IsEmail() email!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const { access_token, user: safeUser } = await this.auth.login(user);

    if (process.env.AUTH_DEBUG === '1') {
      console.log('[AUTH] set-cookie cv_token first16:', access_token.slice(0, 16));
    }

    res.cookie('cv_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token, user: safeUser };
  }

  // === NEW ===
  @Post('forgot-password')
  async forgot(@Body() dto: ForgotDto) {
    await this.auth.forgotPassword(dto.email.trim().toLowerCase());
    return { ok: true };
  }
}
