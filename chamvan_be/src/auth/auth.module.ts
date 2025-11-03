
// //src/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { UsersModule } from '../users/users.module';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtStrategy } from './jwt.strategy';

// @Module({
//   imports: [
//     UsersModule,
//     JwtModule.register({
//       global: true,
//       secret: process.env.JWT_SECRET,
//       // expiresIn có thể set khi sign trong service
//     }),
//   ],
//   providers: [AuthService, JwtStrategy],
//   controllers: [AuthController],
// })
// export class AuthModule {}





import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService, JwtStrategy, MailerService],
  controllers: [AuthController],
})
export class AuthModule {}
