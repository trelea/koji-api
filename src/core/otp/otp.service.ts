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
import { User } from 'src/entities';
import { UsersService } from '../users';

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

  async verifyOTP(hash: string, otp: string, res: Response) {
    /**
     * Check cache
     */
    const data = await this.redisService.get<RegisterDto & { otp: string }>({
      ns: CACHE_NAMESPACE.AUTH,
      key: hash,
    });

    /**
     * validate otp and data from cache
     */
    if (!data) throw new GoneException();
    if (otp !== data.otp) throw new UnauthorizedException('Wrong OTP Code');

    /**
     * create new user
     */
    const { email, password, name } = data;
    await this.usersService.createUser({ email, password, name });

    /**
     * clear cookies and cache
     */
    await this.redisService.del({ ns: CACHE_NAMESPACE.AUTH, key: hash });
    res.clearCookie('_tkn_hsh');
    return true;
  }
}
