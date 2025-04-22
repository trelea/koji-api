import {
  ConflictException,
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
import { CacheService } from 'src/cache';
import { CACHE_NAMESPACE } from 'src/cache/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptogrphy: CryptographyService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: CacheService,
  ) {}

  async register(user: RegisterDto) {
    const exists = await this.usersService.findUserBy({ email: user.email });
    if (exists) throw new ConflictException('Resource already exists');
    return await this.usersService.createUser(user);
  }

  async login(req: Request, res: Response) {
    try {
      const access_token = this.signToken(req.user?.id as string, 'ACCESS');
      const refresh_token = this.signToken(req.user?.id as string, 'REFRESH');

      await this.redisService
        .namespace(CACHE_NAMESPACE.USERS)
        .set(req.user?.id as string, {
          ...req.user,
          access_token,
          refresh_token,
        });

      res.cookie('Access', access_token, {
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:
          parseInt(
            this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
          ) * 1000,
      });
      res.cookie('Refresh', refresh_token, {
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:
          parseInt(
            this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
          ) * 1000,
      });

      return true;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await this.redisService.del(req.user?.id as string);
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
    await this.redisService
      .namespace(CACHE_NAMESPACE.USERS)
      .set(req.user?.id as string, {
        ...req.user,
        access_token,
        refresh_token: req.cookies['Refresh'],
      });

    res.cookie('Access', access_token, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        parseInt(
          this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
        ) * 1000,
    });
    return true;
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserBy({ email });
    if (!user || !(await this.cryptogrphy.verify(user.password, password)))
      throw new UnauthorizedException('Invalid Credentials');
    return user;
  }

  signToken(id: string, type: 'REFRESH' | 'ACCESS') {
    return this.jwtService.sign(
      { id },
      {
        secret: this.configService.getOrThrow<string>(`JWT_${type}_SECRET`),
        expiresIn: parseInt(
          this.configService.getOrThrow<string>(`JWT_${type}_EXPIRATION`),
        ),
      },
    );
  }
}
