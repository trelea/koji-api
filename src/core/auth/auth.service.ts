import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users';
import { RegisterDto } from './dtos';
import { CryptographyService } from 'src/cryptography';
import { Response, Request } from 'express';
import { User } from 'src/entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';
import { OtpService } from '../otp';
import { UserNotConfiguredException } from 'src/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptogrphy: CryptographyService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
  ) {}

  async register(user: RegisterDto, res: Response) {
    const exists = await this.usersService.findUserBy({ email: user.email });
    if (exists) throw new ConflictException('Resource already exists');

    /**
     * 1. genrate otp
     * 2. send otp to user email
     * 3. genrate jwt then hash it
     * 4. store user and otp info in chche for 5 min
     * 5. send jwt in res
     * 6. store hashed as cookie fro 5 min
     */

    const { otp, mail, hashed, jwt } = await this.otpService.OTPExecute({
      to: user.email,
      hash: () => this.signToken(Date.now().toString(), 'OTP'),
      length: 6,
    });

    if (mail?.error)
      throw new InternalServerErrorException('OTP mail delivery failed');

    res.cookie('_tkn_hsh', hashed, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        60 *
        1000 *
        parseInt(this.configService.getOrThrow<string>('JWT_OTP_EXPIRATION')),
    });

    /**
     * Cache otp and user
     */
    await this.redisService.set({
      ns: CACHE_NAMESPACE.OTP,
      key: hashed as string,
      val: { ...user, otp },
      ttl:
        60 *
        1000 *
        parseInt(this.configService.getOrThrow<string>('JWT_OTP_EXPIRATION')),
    });

    /**
     * return redirection to GET /otp/verify?_tkn={jwt}
     */
    return { _tkn: jwt };
  }

  async login(req: Request, res: Response) {
    try {
      const access_token = this.signToken(req.user?.id as string, 'ACCESS');
      const refresh_token = this.signToken(req.user?.id as string, 'REFRESH');

      await this.redisService.set({
        ns: CACHE_NAMESPACE.USERS,
        key: req.user?.id as string,
        val: { access_token, refresh_token, ...req.user },
      });

      res.cookie('Access', access_token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge:
          60 *
          1000 *
          parseInt(
            this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
          ),
      });
      res.cookie('Refresh', refresh_token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge:
          60 *
          1000 *
          parseInt(
            this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
          ),
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (!req.user?.details) throw new UserNotConfiguredException();
    return req.user;
  }

  async logout(req: Request, res: Response) {
    try {
      await this.redisService.del({
        ns: CACHE_NAMESPACE.USERS,
        key: req.user?.id as string,
      });
      res.clearCookie('Access');
      res.clearCookie('Refresh');
      return true;
    } catch (err) {
      return false;
    }
  }

  async refresh(req: Request, res: Response) {
    /**
     * Bypass if access token exists and its valid one
     */
    if (req.cookies['Access']) {
      try {
        this.jwtService.verify(req.cookies['Access'], {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        });
        return false;
      } catch (err) {
        throw new UnauthorizedException();
      }
    }

    const access_token = this.signToken(req.user?.id as string, 'ACCESS');
    await this.redisService.set({
      ns: CACHE_NAMESPACE.USERS,
      key: req.user?.id as string,
      val: { access_token, refresh_token: req.cookies['Refresh'], ...req.user },
    });

    res.cookie('Access', access_token, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        60 *
        1000 *
        parseInt(
          this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
        ),
    });
    return true;
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findUserBy({ email });
    if (!user || !(await this.cryptogrphy.verify(user.password, password)))
      throw new UnauthorizedException('Invalid Credentials');
    const { password: _password, ...rest } = user;
    return rest;
  }

  signToken(id: string, type: 'REFRESH' | 'ACCESS' | 'OTP'): string {
    return this.jwtService.sign(
      { id },
      {
        secret: this.configService.getOrThrow<string>(`JWT_${type}_SECRET`),
        expiresIn:
          60 *
          parseInt(
            this.configService.getOrThrow<string>(`JWT_${type}_EXPIRATION`),
          ),
      },
    );
  }
}
