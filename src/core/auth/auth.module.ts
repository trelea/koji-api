import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users';
import { CryptographyService } from 'src/cryptography';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from './strategies';
import { RedisModule } from 'src/redis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from 'src/config';
import { APP_GUARD } from '@nestjs/core';
import { OtpModule } from '../otp';

@Module({
  imports: [
    ThrottlerModule.forRootAsync(throttlerConfig),
    UsersModule,
    PassportModule,
    JwtModule,
    RedisModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AuthService,
    CryptographyService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
