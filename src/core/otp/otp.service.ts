import {
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailService } from 'src/modules/mail';
import { OTPExecuteRequestType, OTPExecuteResponseType } from './types';
import { generateOTP } from 'src/utils';
import { CryptographyService } from 'src/cryptography';
import { Response } from 'express';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';
import { RegisterDto } from '../auth/dtos';
import { UsersService } from '../users';
import { User } from 'src/entities';

@Injectable()
export class OtpService {
  constructor(
    private readonly mailService: MailService,
    private readonly cryptographyService: CryptographyService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async OTPExecute({
    length = 6,
    hash,
    to,
  }: OTPExecuteRequestType): Promise<Partial<OTPExecuteResponseType>> {
    const otp = generateOTP(length);
    const jwt = hash(otp);
    const hashed = await this.cryptographyService.encrypt(jwt);
    return {
      otp,
      mail: to ? await this.mailService.sendOtpTo(to, otp) : undefined,
      hashed,
      jwt,
    };
  }

  async verifyOTP(hash: string, otp: string, res: Response): Promise<User> {
    /**
     * Check cache
     */
    const data = await this.redisService.get<RegisterDto & { otp: string }>({
      ns: CACHE_NAMESPACE.OTP,
      key: hash,
    });

    /**
     * validate otp and data from cache
     */
    if (!data) throw new GoneException();
    if (otp !== data.otp) throw new UnauthorizedException('Wrong OTP Code');

    /**
     * clear cookies and cache
     */
    const { email, password, name } = data;
    await this.redisService.del({ ns: CACHE_NAMESPACE.OTP, key: hash });
    res.clearCookie('_tkn_hsh');

    /**
     * create new user
     */
    return await this.usersService.createUser({ email, password, name });
  }
}
