import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities';
import { UsersService } from 'src/core/users';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['Refresh'],
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: User) {
    const userCached = await this.redisService.get<User>({
      ns: CACHE_NAMESPACE.USERS,
      key: id,
    });

    const { password, ...user } = (await this.usersService.findUserBy({
      id,
    })) as User;

    if (!user || !userCached) throw new UnauthorizedException();
    return user;
  }
}
