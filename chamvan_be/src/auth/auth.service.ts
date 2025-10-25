// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const normalized = (email ?? '').trim().toLowerCase();

    const withPassword = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password') // vì password có select:false
      .where('LOWER(u.email) = :email', { email: normalized })
      .getOne();

    // --- LOG CHUẨN ĐOÁN: giữ lại tới khi chạy ok rồi xoá ---
    // eslint-disable-next-line no-console
    console.log('[Auth] login email=', normalized, 'found=', !!withPassword);

    if (!withPassword) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const ok = await bcrypt.compare(pass ?? '', withPassword.password);
    // eslint-disable-next-line no-console
    console.log('[Auth] compare ok =', ok);

    if (!ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const { password, ...safe } = withPassword;
    return safe as User;
  }

  async login(user: User) {
    const payload: { sub: string; email: string; role: UserRole } = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user };
  }
}
