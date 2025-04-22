import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheService } from 'src/cache';
import { CACHE_NAMESPACE } from 'src/cache/config';
import { User } from 'src/entities';
import { UsersService } from 'src/modules/users';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly redisService: CacheService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: User) {
    return (
      (await this.redisService.namespace(CACHE_NAMESPACE.USERS).get(id)) &&
      (await this.usersService.findUserBy({ id }))
    );
  }
}
