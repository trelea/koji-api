import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['Access'],
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: User) {
    const { password, ...user } = (await this.redisService.get<User>({
      ns: CACHE_NAMESPACE.USERS,
      key: id,
    })) as User;
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
