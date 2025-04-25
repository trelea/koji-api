import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MailModule } from 'src/modules/mail';
import { CryptographyService } from 'src/cryptography';
import { OTPStrategy } from './strategies';
import { RedisModule } from 'src/redis';
import { UsersModule } from '../users';

@Module({
  imports: [MailModule, RedisModule, UsersModule],
  controllers: [OtpController],
  providers: [OtpService, CryptographyService, OTPStrategy],
  exports: [OtpService],
})
export class OtpModule {}
