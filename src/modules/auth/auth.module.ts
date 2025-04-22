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
import { CacheModule } from 'src/cache';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, CacheModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptographyService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
