import {
  ConflictException,
  Injectable,
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
    const access_token = this.signToken(req.user?.id as string, 'ACCESS');
    const refresh_token = this.signToken(req.user?.id as string, 'REFRESH');

    await this.redisService
      .namespace(CACHE_NAMESPACE.USERS)
      .set(req.user?.id as string, {
        ...req.user,
        access_token,
        refresh_token,
      });

    res.setHeader('Authorization', `Bearer ${access_token}`);
    res.setHeader('Refresh', `Bearer ${refresh_token}`);

    return {
      access_token,
      refresh_token,
    };
  }

  async logout(req: Request) {
    await this.redisService.del(req.user?.id as string);
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
