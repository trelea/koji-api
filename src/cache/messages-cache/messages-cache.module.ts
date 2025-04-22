import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_NAMESPACE } from '../config';
import { MessagesCacheService } from './messages-cache.service';
import redisUri from '../config/redis-uri';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(redisUri(config), { namespace: CACHE_NAMESPACE.MESSAGES }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MessagesCacheService],
  exports: [MessagesCacheService],
})
export class MessagesCacheModule {}
