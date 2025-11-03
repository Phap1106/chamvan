// // src/auth/auth.service.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import * as bcrypt from 'bcryptjs';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User, UserRole } from '../users/user.entity';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User) private readonly users: Repository<User>,
//     private readonly jwt: JwtService,
//   ) {}

//   async validateUser(email: string, pass: string) {
//     const withPassword = await this.users.findOne({
//       where: { email },
//       select: ['id', 'email', 'password', 'fullName', 'role'],
//     });
//     if (!withPassword) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

//     const ok = await bcrypt.compare(pass, withPassword.password || '');
//     if (!ok) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

//     const { password, ...safe } = withPassword;
//     return safe as User;
//   }

//   async login(user: User) {
//     const payload: { sub: string; email: string; role: UserRole } = {
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//     };
//     const access_token = await this.jwt.signAsync(payload);
//     return { access_token, user };
//   }
// }






import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from './mailer.service';

function randomPassword(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async validateUser(email: string, pass: string) {
    const withPassword = await this.users.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'role'],
    });
    if (!withPassword) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const ok = await bcrypt.compare(pass, withPassword.password || '');
    if (!ok) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

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

  // === NEW: Forgot password ===
  async forgotPassword(email: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email không tồn tại');

    const newPass = randomPassword(8);
    const hashed = await bcrypt.hash(newPass, 10);

    await this.users.update({ id: user.id }, { password: hashed });

    await this.mailer.resetPasswordEmail(user.email, newPass);

    return { ok: true };
  }
}
