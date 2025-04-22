import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_NAMESPACE } from '../config';
import { UsersCacheService } from './users-cache.service';
import redisUri from '../config/redis-uri';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(redisUri(config), { namespace: CACHE_NAMESPACE.USERS }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersCacheService],
  exports: [UsersCacheService],
})
export class UsersCacheModule {}
